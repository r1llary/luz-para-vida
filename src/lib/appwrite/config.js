/**
 * Configuração do Appwrite.
 * Valores via EXPO_PUBLIC_* no .env (reinicie o Metro: npx expo start -c).
 */

const env =
  typeof process !== 'undefined' && process.env ? process.env : {};

const APPWRITE_ENDPOINT =
  env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';

const APPWRITE_PROJECT_ID = env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '';

/** ID do Database (Tables) no Appwrite */
export const DATABASE_ID = env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '';

/**
 * IDs das collections (Table IDs no console).
 * Fallbacks = nomes usados em docs/APPWRITE_COLLECTIONS.md
 */
export const COLLECTION_IDS = {
  usuarios: env.EXPO_PUBLIC_APPWRITE_COLLECTION_USUARIOS || 'usuarios',
  celulas: env.EXPO_PUBLIC_APPWRITE_COLLECTION_CELULAS || 'celulas',
  membros: env.EXPO_PUBLIC_APPWRITE_COLLECTION_MEMBROS || 'membros',
  relatorios: env.EXPO_PUBLIC_APPWRITE_COLLECTION_RELATORIOS || 'relatorios',
};

/** Bucket Storage para fotos de perfil (criar no Console → Storage) */
export const BUCKET_AVATARS_ID =
  env.EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES || '';

export const APPWRITE_ENDPOINT_CONFIG = APPWRITE_ENDPOINT;
export const APPWRITE_PROJECT_ID_CONFIG = APPWRITE_PROJECT_ID;

/** True quando o projeto Appwrite está configurado (login / SDK). */
export function isAppwriteConfigured() {
  return Boolean(APPWRITE_PROJECT_ID && APPWRITE_PROJECT_ID.trim() !== '');
}

/** True quando database + collections estão definidos (persistência nos formulários). */
export function isAppwriteDatabaseConfigured() {
  if (!isAppwriteConfigured() || !DATABASE_ID.trim()) return false;
  const { celulas, membros, relatorios } = COLLECTION_IDS;
  return Boolean(celulas && membros && relatorios);
}
