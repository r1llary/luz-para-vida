import { ID, Query } from 'appwrite';
import {
  DATABASE_ID,
  COLLECTION_IDS,
  BUCKET_AVATARS_ID,
  isAppwriteDatabaseConfigured,
  getAppwriteClient,
  getAppwriteDatabases,
  getAppwriteStorage,
} from '../../lib/appwrite';
import { restoreAppwriteSessionFromStorage } from './authService';

function db() {
  return getAppwriteDatabases();
}

function ensureConfig() {
  return isAppwriteDatabaseConfigured();
}

function celulaImagemViewUrl(fileId) {
  if (!fileId || !BUCKET_AVATARS_ID) return null;
  const storage = getAppwriteStorage();
  if (!storage) return null;
  return storage.getFileView(BUCKET_AVATARS_ID, fileId);
}

/** Valor salvo em `imagemDestaque`: ID do ficheiro OU URL completa (atributo tipo URL no console). */
function celulaImagemDisplayUrl(stored) {
  if (!stored || typeof stored !== 'string') return null;
  const s = stored.trim();
  if (!s) return null;
  if (/^https?:\/\//i.test(s)) return s;
  return celulaImagemViewUrl(s);
}

/** Array de strings no documento (nativo Appwrite ou JSON legado). */
function parseStringArrayField(raw) {
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      if (Array.isArray(p)) return p.filter(Boolean).map(String);
    } catch (_) {
      return [];
    }
  }
  return [];
}

async function appendIdToCelulaArrayField(celulaId, fieldName, newId) {
  if (!ensureConfig() || !celulaId || !newId || !fieldName) return;
  const d = db();
  if (!d) return;
  try {
    const doc = await d.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.celulas,
      celulaId,
    );
    const cur = parseStringArrayField(doc[fieldName]);
    if (cur.includes(newId)) return;
    await d.updateDocument(DATABASE_ID, COLLECTION_IDS.celulas, celulaId, {
      [fieldName]: [...cur, newId],
    });
  } catch (_) {
    /* atributo ausente ou permissão */
  }
}

async function removeIdFromCelulaArrayField(celulaId, fieldName, idToRemove) {
  if (!ensureConfig() || !celulaId || !idToRemove || !fieldName) return;
  const d = db();
  if (!d) return;
  try {
    const doc = await d.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.celulas,
      celulaId,
    );
    const cur = parseStringArrayField(doc[fieldName]);
    const next = cur.filter((x) => x !== idToRemove);
    if (next.length === cur.length) return;
    await d.updateDocument(DATABASE_ID, COLLECTION_IDS.celulas, celulaId, {
      [fieldName]: next,
    });
  } catch (_) {
    /* noop */
  }
}

/** Acrescenta um Auth `userId` ao array `membros` da célula (membro com conta no app). */
export async function appendMembroUserIdToCelulaAppwrite(celulaId, userId) {
  const uid = (userId || '').trim();
  if (!uid) return;
  return appendIdToCelulaArrayField(celulaId, 'membros', uid);
}

/**
 * Reuniões não são mais referenciadas no documento `celulas` (sem atributo `reunioes` no Appwrite).
 * A listagem segue por `celulaId` na collection de reuniões.
 */
export async function appendReuniaoIdToCelulaAppwrite(_celulaId, _reuniaoDocId) {
  return;
}

function parseMembrosPresentesIdsFromDoc(doc) {
  const raw = doc.membrosPresentesIds;
  if (Array.isArray(raw)) return raw.filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      return Array.isArray(p) ? p.filter(Boolean) : [];
    } catch (_) {
      return [];
    }
  }
  return [];
}

function parseVisitantesDetalhesFromDoc(doc) {
  const raw = doc.visitantesDetalhes;
  if (Array.isArray(raw)) {
    return raw
      .filter((x) => x && typeof x.nome === 'string')
      .map((x) => ({
        nome: String(x.nome || '').trim(),
        telefone: x.telefone != null ? String(x.telefone).trim() : '',
        observacoes:
          x.observacoes != null ? String(x.observacoes).trim() : '',
      }));
  }
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const p = JSON.parse(raw);
      if (!Array.isArray(p)) return [];
      return p
        .filter((x) => x && typeof x.nome === 'string')
        .map((x) => ({
          nome: String(x.nome || '').trim(),
          telefone: x.telefone != null ? String(x.telefone).trim() : '',
          observacoes:
            x.observacoes != null ? String(x.observacoes).trim() : '',
        }));
    } catch (_) {
      return [];
    }
  }
  return [];
}

export async function createVisitanteAppwrite(payload) {
  if (!ensureConfig() || !COLLECTION_IDS.visitantes) return null;
  const d = db();
  if (!d) return null;
  const id = ID.unique();
  try {
    await d.createDocument(DATABASE_ID, COLLECTION_IDS.visitantes, id, {
      celulaId: payload.celulaId ?? '',
      reuniaoId: payload.reuniaoId ?? '',
      nome: payload.nome ?? '',
      telefone: payload.telefone ?? '',
      observacoes: payload.observacoes ?? '',
    });
    return id;
  } catch (_) {
    return null;
  }
}

export async function listVisitantesByReuniaoAppwrite(reuniaoId) {
  if (!ensureConfig() || !reuniaoId || !COLLECTION_IDS.visitantes) return [];
  const d = db();
  if (!d) return [];
  try {
    const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.visitantes, [
      Query.equal('reuniaoId', [reuniaoId]),
    ]);
    return (res.documents || []).map(normalizeDocument);
  } catch (_) {
    return [];
  }
}

function mapReuniaoDocument(doc) {
  const n = normalizeDocument(doc);
  const visitantesLista = parseVisitantesDetalhesFromDoc(n);
  let membrosPresentesIds = parseMembrosPresentesIdsFromDoc(n);
  if (Array.isArray(n.membrosPresentes) && n.membrosPresentes.length > 0) {
    const mp = n.membrosPresentes.filter(Boolean);
    if (typeof mp[0] === 'string') {
      membrosPresentesIds = mp;
    }
  }
  const dataReuniao = n.dataReuniao || n.data || '';
  const temaMinistrado = n.temaMinistrado || n.tema || '';
  const textoBase = n.textoBase ?? n.observacoes ?? '';
  return {
    ...n,
    dataReuniao,
    temaMinistrado,
    textoBase,
    membrosPresentesIds,
    visitantesLista,
  };
}

/**
 * Células do usuário logado.
 */
export async function listCelulasAppwrite(userId) {
  restoreAppwriteSessionFromStorage();
  if (!ensureConfig()) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.celulas, [
    Query.equal('userId', [userId]),
    Query.orderDesc('$createdAt'),
  ]);
  return (res.documents || []).map(mapCelulaDocument);
}

/**
 * Lista collections do database no console (debug).
 * O SDK web/cliente não expõe `listCollections`; usa GET REST via `Client.call`.
 * Requer permissão de leitura no database (sessão ou escopo adequado).
 */
export async function logAppwriteDatabaseCollections() {
  if (!ensureConfig()) {
    console.log('[Appwrite collections] Database não configurado.');
    return;
  }
  restoreAppwriteSessionFromStorage();
  const client = getAppwriteClient();
  if (!client) {
    console.log('[Appwrite collections] Cliente Appwrite indisponível.');
    return;
  }
  try {
    const base = String(client.config.endpoint || '').replace(/\/$/, '');
    const uri = new URL(`${base}/databases/${DATABASE_ID}/collections`);
    const data = await client.call('get', uri, {}, {
      queries: [Query.limit(500)],
    });
    const collections = data.collections ?? [];
    console.log(
      '[Appwrite collections]',
      collections.map((c) => ({
        $id: c.$id,
        name: c.name,
        enabled: c.enabled,
      }))
    );
    console.log('[Appwrite collections] total:', data.total ?? collections.length);
  } catch (err) {
    console.log(
      '[Appwrite collections] erro:',
      err?.message,
      err?.code,
      err?.response
    );
  }
}

function mapCelulaDocument(doc) {
  const n = normalizeDocument(doc);
  const { lider, colider, ...raw } = n;
  const fileId = n.imagemDestaque || n.imagem_destaque || '';
  const liderUserId = String(lider ?? n.liderUserId ?? '').trim();
  const coLiderUserId = String(colider ?? n.coLiderUserId ?? '').trim();
  return {
    ...raw,
    liderUserId,
    coLiderUserId,
    membros: parseStringArrayField(n.membros),
    /** Não persistido no Appwrite; lista de reuniões vem só do contexto/cache. */
    reunioes: [],
    imagemUrl:
      celulaImagemDisplayUrl(fileId) ?? n.imagemUrl ?? null,
  };
}

/** Converte campos internos para os nomes da collection `celulas` no console (`lider`, `colider`). */
function mapCelulaPartialToAppwrite(partial) {
  if (!partial || typeof partial !== 'object') return partial;
  const p = { ...partial };
  if (Object.prototype.hasOwnProperty.call(p, 'liderUserId')) {
    p.lider = p.liderUserId ?? '';
    delete p.liderUserId;
  }
  if (Object.prototype.hasOwnProperty.call(p, 'coLiderUserId')) {
    p.colider = p.coLiderUserId ?? '';
    delete p.coLiderUserId;
  }
  if ('reunioes' in p) delete p.reunioes;
  if ('imagemUrl' in p) delete p.imagemUrl;
  return p;
}

export async function createCelulaAppwrite(userId, celula) {
  if (!ensureConfig()) return null;
  const d = db();
  if (!d) return null;
  const id = ID.unique();
  const rawMembros = Array.isArray(celula.membros)
    ? celula.membros.filter(Boolean).map(String)
    : [];
  /** Criador da célula entra em `membros[]` para aparecer na lista (mesmo ID do Auth). */
  const membrosInit =
    userId && !rawMembros.includes(userId)
      ? [...rawMembros, userId]
      : rawMembros;
  const coliderVal = String(
    celula.coLiderUserId ?? celula.colider ?? '',
  ).trim();

  /** Schema Appwrite: `lider` / `colider` (texto); líder = usuário que cria a célula. */
  const base = {
    userId,
    nomeCelula: celula.nomeCelula ?? '',
    local: celula.local ?? '',
    endereco: celula.endereco ?? '',
    dia: celula.dia ?? '',
    horario: celula.horario ?? '',
    celulaRaiz: celula.celulaRaiz ?? '',
    imagemDestaque: celula.imagemDestaque ?? '',
    membros: membrosInit,
    lider: userId,
    colider: coliderVal,
  };

  const minimal = {
    userId,
    nomeCelula: base.nomeCelula,
    local: base.local,
    endereco: base.endereco,
    dia: base.dia,
    horario: base.horario,
    celulaRaiz: base.celulaRaiz,
    membros: membrosInit,
    lider: userId,
    colider: coliderVal,
  };

  const attempts = [base, minimal];
  let lastErr;
  for (const payload of attempts) {
    try {
      await d.createDocument(DATABASE_ID, COLLECTION_IDS.celulas, id, payload);
      lastErr = null;
      break;
    } catch (e) {
      lastErr = e;
    }
  }
  if (lastErr) throw lastErr;
  return id;
}

export async function updateCelulaAppwrite(celulaId, partial) {
  if (!ensureConfig() || !celulaId) return;
  const d = db();
  if (!d) return;
  const payload = mapCelulaPartialToAppwrite(partial);
  await d.updateDocument(
    DATABASE_ID,
    COLLECTION_IDS.celulas,
    celulaId,
    payload,
  );
}

/**
 * Reuniões de célula (collection em `RELATORIOS`; modelo novo: `data`, `tema`, `visitantes` como IDs).
 */
export async function listReunioesByCelulaAppwrite(celulaId) {
  if (!ensureConfig() || !celulaId) return [];
  const d = db();
  if (!d) return [];
  let res;
  try {
    res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
      Query.equal('celulaId', [celulaId]),
      Query.orderDesc('data'),
    ]);
  } catch (_) {
    try {
      res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
        Query.equal('celulaId', [celulaId]),
        Query.orderDesc('dataReuniao'),
      ]);
    } catch {
      res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
        Query.equal('celulaId', [celulaId]),
        Query.orderDesc('$createdAt'),
      ]);
    }
  }
  const docs = res.documents || [];
  return Promise.all(
    docs.map(async (doc) => {
      const n = mapReuniaoDocument(doc);
      if (
        (!n.visitantesLista || n.visitantesLista.length === 0) &&
        COLLECTION_IDS.visitantes
      ) {
        try {
          const rows = await listVisitantesByReuniaoAppwrite(doc.$id);
          if (rows.length) {
            n.visitantesLista = rows.map((r) => ({
              nome: String(r.nome || '').trim(),
              telefone: String(r.telefone ?? '').trim(),
              observacoes: String(r.observacoes ?? '').trim(),
            }));
          }
        } catch {
          /* noop */
        }
      }
      return n;
    }),
  );
}

export async function createReuniaoAppwrite(celulaId, dados) {
  if (!ensureConfig() || !celulaId) return null;
  const d = db();
  if (!d) return null;
  const docId = ID.unique();
  const ids = Array.isArray(dados.membrosPresentesIds)
    ? dados.membrosPresentesIds.filter(Boolean)
    : [];
  const membrosCount =
    ids.length > 0 ? ids.length : Number(dados.membrosPresentes) || 0;
  const lista =
    Array.isArray(dados.visitantesLista) && dados.visitantesLista.length > 0
      ? dados.visitantesLista.map((v) => ({
          nome: String(v?.nome ?? '').trim(),
          telefone: String(v?.telefone ?? '').trim(),
          observacoes: String(v?.observacoes ?? '').trim(),
        }))
      : [];
  const visitantesCount =
    lista.length > 0
      ? lista.length
      : Number(dados.visitantes) || 0;
  const visitantesDetalhesJson =
    lista.length > 0 ? JSON.stringify(lista) : '';
  const dataVal = dados.dataReuniao ?? dados.data ?? '';
  const temaVal = dados.temaMinistrado ?? dados.tema ?? '';
  const obsVal = dados.textoBase ?? dados.observacoes ?? '';

  const visitanteDocIds = [];
  if (COLLECTION_IDS.visitantes && lista.length > 0) {
    for (const v of lista) {
      const vid = await createVisitanteAppwrite({
        celulaId,
        reuniaoId: docId,
        nome: v.nome,
        telefone: v.telefone,
        observacoes: v.observacoes ?? '',
      });
      if (vid) visitanteDocIds.push(vid);
    }
  }

  const novoModelo = {
    celulaId,
    data: dataVal,
    tema: temaVal,
    observacoes: obsVal,
    membrosPresentes: ids,
    visitantes: visitanteDocIds,
  };

  const legado = {
    celulaId,
    dataReuniao: dataVal,
    temaMinistrado: temaVal,
    textoBase: obsVal,
    visitantes: visitantesCount,
    membrosPresentes: membrosCount,
    membrosPresentesIds: JSON.stringify(ids),
    ...(visitantesDetalhesJson
      ? { visitantesDetalhes: visitantesDetalhesJson }
      : {}),
  };

  try {
    await d.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.relatorios,
      docId,
      novoModelo,
    );
  } catch (_) {
    await d.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.relatorios,
      docId,
      legado,
    );
  }

  await appendReuniaoIdToCelulaAppwrite(celulaId, docId);
  return docId;
}

/**
 * Membros da célula: lê `celulas.membros[]` (Auth user IDs) e monta a lista a partir dos docs `usuarios`.
 */
function mapUsuarioToMembroView(udoc, celulaId) {
  const u = normalizeDocument(udoc);
  const uid = String(u.userId || u.id || '').trim();
  return {
    ...u,
    id: uid,
    celulaId,
    userId: uid,
  };
}

export async function listMembrosByCelulaAppwrite(celulaId) {
  if (!ensureConfig() || !celulaId || !COLLECTION_IDS.usuarios) return [];
  const d = db();
  if (!d) return [];
  try {
    const celulaDoc = await d.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.celulas,
      celulaId,
    );
    const userIds = parseStringArrayField(celulaDoc.membros);
    const out = [];
    for (const uid of userIds) {
      if (!uid) continue;
      try {
        const udoc = await d.getDocument(
          DATABASE_ID,
          COLLECTION_IDS.usuarios,
          uid,
        );
        out.push(mapUsuarioToMembroView(udoc, celulaId));
      } catch (_) {
        out.push({
          id: uid,
          celulaId,
          userId: uid,
          nomeCompleto: '—',
          email: '',
        });
      }
    }
    return out;
  } catch (e) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn('[listMembrosByCelulaAppwrite]', e);
    }
    return [];
  }
}

/** Remove o vínculo do usuário à célula (`celulas.membros[]`). Não apaga conta Auth/usuarios. */
export async function deleteMembroAppwrite(celulaId, membroDocId, membroUserId) {
  const uid = String((membroUserId || membroDocId || '').trim());
  if (!ensureConfig() || !celulaId || !uid) return;
  await removeIdFromCelulaArrayField(celulaId, 'membros', uid);
}

export async function deleteReuniaoAppwrite(celulaId, reuniaoId) {
  if (!ensureConfig() || !celulaId || !reuniaoId) return;
  const d = db();
  if (!d) return;
  if (COLLECTION_IDS.visitantes) {
    try {
      const visitantes = await listVisitantesByReuniaoAppwrite(reuniaoId);
      for (const v of visitantes) {
        try {
          await d.deleteDocument(
            DATABASE_ID,
            COLLECTION_IDS.visitantes,
            v.id,
          );
        } catch (_) {
          /* noop */
        }
      }
    } catch (_) {
      /* noop */
    }
  }
  try {
    await d.deleteDocument(
      DATABASE_ID,
      COLLECTION_IDS.relatorios,
      reuniaoId,
    );
  } catch (_) {
    return;
  }
}

/** @deprecated use listReunioesByCelulaAppwrite */
export async function getRelatorioAppwrite(celulaId) {
  const list = await listReunioesByCelulaAppwrite(celulaId);
  return list[0] || null;
}

/** @deprecated use createReuniaoAppwrite */
export async function saveRelatorioAppwrite(celulaId, dados) {
  return createReuniaoAppwrite(celulaId, {
    ...dados,
    dataReuniao: dados.dataReuniao || new Date().toISOString().slice(0, 10),
  });
}

function normalizeDocument(doc) {
  const out = { ...doc, id: doc.$id };
  delete out.$id;
  delete out.$createdAt;
  delete out.$updatedAt;
  delete out.$permissions;
  delete out.$databaseId;
  delete out.$collectionId;
  if (doc.$createdAt) out.createdAt = doc.$createdAt;
  if (doc.$updatedAt) out.updatedAt = doc.$updatedAt;
  return out;
}
