import { ID, Query } from 'appwrite';
import {
  DATABASE_ID,
  COLLECTION_IDS,
  isAppwriteDatabaseConfigured,
} from '../../lib/appwrite';
import { getAppwriteDatabases } from '../../lib/appwrite';

function db() {
  return getAppwriteDatabases();
}

function ensureConfig() {
  return isAppwriteDatabaseConfigured();
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

function mapReuniaoDocument(doc) {
  const n = normalizeDocument(doc);
  return {
    ...n,
    membrosPresentesIds: parseMembrosPresentesIdsFromDoc(n),
  };
}

export async function listAllCelulasAppwrite() {
  if (!ensureConfig()) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.celulas, [
    Query.orderDesc('$createdAt'),
  ]);
  return (res.documents || []).map(normalizeDocument);
}

/**
 * Células do usuário logado.
 */
export async function listCelulasAppwrite(userId) {
  if (!ensureConfig()) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.celulas, [
    Query.equal('userId', [userId]),
    Query.orderDesc('$createdAt'),
  ]);
  return (res.documents || []).map(normalizeDocument);
}

export async function createCelulaAppwrite(userId, celula) {
  if (!ensureConfig()) return null;
  const d = db();
  if (!d) return null;
  const id = ID.unique();
  await d.createDocument(
    DATABASE_ID,
    COLLECTION_IDS.celulas,
    id,
    {
      userId,
      nomeCelula: celula.nomeCelula ?? '',
      local: celula.local ?? '',
      endereco: celula.endereco ?? '',
      dia: celula.dia ?? '',
      horario: celula.horario ?? '',
      imagemUrl: celula.imagemUrl ?? '',
      celulaRaiz: celula.celulaRaiz ?? '',
      temaMinistrado: celula.temaMinistrado ?? '',
      textoBase: celula.textoBase ?? '',
      visitantes: Number(celula.visitantes) || 0,
      membrosPresentes: Number(celula.membrosPresentes) || 0,
    }
  );
  return id;
}

/**
 * Reuniões de célula (collection `relatorios`: um documento por reunião).
 * Atributo `dataReuniao`: string YYYY-MM-DD (identificador junto à célula).
 */
export async function listReunioesByCelulaAppwrite(celulaId) {
  if (!ensureConfig() || !celulaId) return [];
  const d = db();
  if (!d) return [];
  try {
    const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
      Query.equal('celulaId', [celulaId]),
      Query.orderDesc('dataReuniao'),
    ]);
    return (res.documents || []).map(mapReuniaoDocument);
  } catch (_) {
    const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
      Query.equal('celulaId', [celulaId]),
      Query.orderDesc('$createdAt'),
    ]);
    return (res.documents || []).map(mapReuniaoDocument);
  }
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
  const basePayload = {
    celulaId,
    dataReuniao: dados.dataReuniao ?? '',
    temaMinistrado: dados.temaMinistrado ?? '',
    textoBase: dados.textoBase ?? '',
    visitantes: Number(dados.visitantes) || 0,
    membrosPresentes: membrosCount,
  };
  try {
    await d.createDocument(DATABASE_ID, COLLECTION_IDS.relatorios, docId, {
      ...basePayload,
      membrosPresentesIds: JSON.stringify(ids),
    });
  } catch (_) {
    await d.createDocument(DATABASE_ID, COLLECTION_IDS.relatorios, docId, basePayload);
  }
  return docId;
}

export async function getUserByEmailAppwrite(email) {
  if (!ensureConfig() || !email) return null;
  const d = db();
  if (!d) return null;
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.usuarios, [
    Query.equal('email', [email.toLowerCase().trim()]),
    Query.limit(1),
  ]);
  const doc = (res.documents || [])[0];
  return doc ? normalizeDocument(doc) : null;
}

export async function listMembrosByEmailAppwrite(email) {
  if (!ensureConfig() || !email) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.membros, [
    Query.equal('email', [email]),
  ]);
  return (res.documents || []).map(normalizeDocument);
}

export async function listCelulasByIdsAppwrite(ids) {
  if (!ensureConfig() || !ids?.length) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.celulas, [
    Query.equal('$id', ids),
    Query.orderDesc('$createdAt'),
  ]);
  return (res.documents || []).map(normalizeDocument);
}

/**
 * Membros de uma célula.
 */
export async function listMembrosByCelulaAppwrite(celulaId) {
  if (!ensureConfig()) return [];
  const d = db();
  if (!d) return [];
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.membros, [
    Query.equal('celulaId', [celulaId]),
    Query.orderDesc('$createdAt'),
  ]);
  return (res.documents || []).map(normalizeDocument);
}

export async function createMembroAppwrite(celulaId, membro) {
  if (!ensureConfig()) return null;
  const d = db();
  if (!d) return null;
  const id = ID.unique();
  await d.createDocument(
    DATABASE_ID,
    COLLECTION_IDS.membros,
    id,
    {
      celulaId,
      nomeCompleto: membro.nomeCompleto ?? '',
      cpfRg: membro.cpfRg ?? '',
      email: membro.email ?? '',
      telefone: membro.telefone ?? '',
      rua: membro.rua ?? '',
      numero: membro.numero ?? '',
      complemento: membro.complemento ?? '',
      bairro: membro.bairro ?? '',
      cidade: membro.cidade ?? '',
      cep: membro.cep ?? '',
      data: membro.data ?? '',
    }
  );
  return id;
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
