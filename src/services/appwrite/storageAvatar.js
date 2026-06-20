import { ID, Permission, Role } from 'appwrite';
import {
  BUCKET_AVATARS_ID,
  APPWRITE_ENDPOINT_CONFIG,
  APPWRITE_PROJECT_ID_CONFIG,
} from '../../lib/appwrite/config';
import { getAppwriteClient, getAppwriteStorage } from '../../lib/appwrite';

function resolveSession(client) {
  if (client.config.session) return client.config.session;
  try {
    const raw =
      typeof globalThis !== 'undefined' && globalThis.localStorage
        ? globalThis.localStorage.getItem('cookieFallback')
        : null;
    if (raw) {
      const cookie = JSON.parse(raw);
      const sid = cookie[`a_session_${client.config.project}`];
      if (sid) {
        client.setSession(sid);
        return sid;
      }
    }
  } catch (_) {
    /* noop */
  }
  return null;
}

/**
 * Upload genérico de imagem (URI local) para um bucket do Appwrite.
 * Funciona tanto em React Native nativo quanto no browser (Expo Web).
 * Retorna o fileId do arquivo criado.
 */
async function uploadFileToStorage(localUri, userId, bucketId) {
  const client = getAppwriteClient();
  if (!client) throw new Error('Cliente Appwrite não disponível.');

  const sessionSecret = resolveSession(client);
  if (!sessionSecret) {
    throw new Error(
      'Sessão expirada. Saia e entre novamente para enviar a imagem.',
    );
  }

  let filePayload;
  if (typeof document !== 'undefined') {
    // Expo Web: converte blob URL em File
    const blob = await fetch(localUri).then((r) => r.blob());
    filePayload = new File([blob], 'imagem.jpg', { type: 'image/jpeg' });
  } else {
    // React Native nativo
    filePayload = { uri: localUri, name: 'imagem.jpg', type: 'image/jpeg' };
  }

  const fileId = ID.unique();
  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', filePayload);
  [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ].forEach((p) => formData.append('permissions[]', p));

  const base = APPWRITE_ENDPOINT_CONFIG.replace(/\/$/, '');
  const url = `${base}/storage/buckets/${bucketId}/files`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': APPWRITE_PROJECT_ID_CONFIG,
      'X-Appwrite-Session': sessionSecret,
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data?.message || `Erro ao enviar imagem (HTTP ${res.status}).`);
  }
  return data.$id || null;
}

/**
 * Upload da foto de perfil do usuário.
 */
export async function uploadAvatarFromUri(localUri, userId) {
  if (!localUri || !userId) return null;
  if (!BUCKET_AVATARS_ID) {
    throw new Error(
      'Bucket de fotos não configurado. Adicione EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES no .env e reinicie o app.',
    );
  }
  return uploadFileToStorage(localUri, userId, BUCKET_AVATARS_ID);
}

/**
 * Upload de imagem de capa de célula. Reutiliza o mesmo bucket de avatares.
 */
export async function uploadCelulaImageFromUri(localUri, userId) {
  if (!localUri || !userId) return null;
  if (!BUCKET_AVATARS_ID) {
    throw new Error(
      'Bucket de imagens não configurado. Adicione EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES no .env e reinicie o app.',
    );
  }
  return uploadFileToStorage(localUri, userId, BUCKET_AVATARS_ID);
}

/**
 * URL de visualização de um arquivo no storage.
 */
export function getFileViewUrl(fileId) {
  if (!fileId || !BUCKET_AVATARS_ID) return null;
  const storage = getAppwriteStorage();
  if (!storage) return null;
  return storage.getFileView(BUCKET_AVATARS_ID, fileId);
}

/**
 * URL de visualização do avatar do usuário.
 */
export function getAvatarViewUrl(fileId) {
  return getFileViewUrl(fileId);
}
