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

/**
 * Relatórios (um por célula; atualizamos o mais recente ou criamos).
 */
export async function getRelatorioAppwrite(celulaId) {
  if (!ensureConfig()) return null;
  const d = db();
  if (!d) return null;
  const res = await d.listDocuments(DATABASE_ID, COLLECTION_IDS.relatorios, [
    Query.equal('celulaId', [celulaId]),
    Query.orderDesc('$createdAt'),
    Query.limit(1),
  ]);
  const doc = res.documents?.[0];
  return doc ? normalizeDocument(doc) : null;
}

export async function saveRelatorioAppwrite(celulaId, dados) {
  if (!ensureConfig()) return null;
  const d = db();
  if (!d) return null;
  const existing = await getRelatorioAppwrite(celulaId);
  const payload = {
    temaMinistrado: dados.temaMinistrado ?? '',
    textoBase: dados.textoBase ?? '',
    visitantes: Number(dados.visitantes) || 0,
    membrosPresentes: Number(dados.membrosPresentes) || 0,
  };
  if (existing) {
    await d.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.relatorios,
      existing.id,
      payload
    );
    return existing.id;
  }
  const id = ID.unique();
  await d.createDocument(
    DATABASE_ID,
    COLLECTION_IDS.relatorios,
    id,
    { celulaId, ...payload }
  );
  return id;
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
