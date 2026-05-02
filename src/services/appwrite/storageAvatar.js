import { ID, Permission, Role } from 'appwrite';
import {
  BUCKET_AVATARS_ID,
  APPWRITE_ENDPOINT_CONFIG,
  APPWRITE_PROJECT_ID_CONFIG,
} from '../../lib/appwrite/config';
import { getAppwriteClient, getAppwriteStorage } from '../../lib/appwrite';

/** Evita import circular com authService; espelha restoreAppwriteSessionFromStorage. */
function ensureClientSession(client) {
  if (!client) return false;
  if (client.config.session || client.headers['X-Appwrite-Session']) return true;
  try {
    const ls = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    if (ls) {
      const raw = ls.getItem('cookieFallback');
      if (raw) {
        const cookie = JSON.parse(raw);
        const sid = cookie[`a_session_${client.config.project}`];
        if (sid) {
          client.setSession(sid);
          return true;
        }
      }
    }
  } catch (_) {
    /* noop */
  }
  return !!(client.config.session || client.headers['X-Appwrite-Session']);
}

function sessionHeaders(client) {
  const session =
    client.headers['X-Appwrite-Session'] ||
    client.config.session ||
    '';
  const h = {
    'X-Appwrite-Project':
      client.headers['X-Appwrite-Project'] || APPWRITE_PROJECT_ID_CONFIG,
    'X-Appwrite-Session': session,
  };
  try {
    const ls = typeof globalThis !== 'undefined' ? globalThis.localStorage : null;
    if (ls) {
      const cf = ls.getItem('cookieFallback');
      if (cf) h['X-Fallback-Cookies'] = cf;
    }
  } catch (_) {
    /* noop */
  }
  return h;
}

function logUploadFailure(label, res, bodyText, jsonBody) {
  if (typeof __DEV__ === 'undefined' || !__DEV__) return;
  console.warn(`[${label}] upload falhou`, res?.status, jsonBody?.message || bodyText);
}

/**
 * Tenta upload via SDK (web / ambiente com File); falha graciosamente no RN puro.
 */
async function tryStorageCreateFile(bucketId, localUri, fileName, mimeType, userId) {
  if (!bucketId || typeof File === 'undefined') return null;
  const storage = getAppwriteStorage();
  if (!storage) return null;
  try {
    const response = await fetch(localUri);
    const blob = await response.blob();
    const type = mimeType || blob.type || 'image/jpeg';
    const file = new File([blob], fileName, { type });
    const fileId = ID.unique();
    const permissions = [
      Permission.read(Role.user(userId)),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ];
    const created = await storage.createFile(bucketId, fileId, file, permissions);
    return created.$id || null;
  } catch (_) {
    return null;
  }
}

/**
 * Upload multipart compatível com React Native (`file`: { uri, name, type }).
 * Sem `permissions` no form: o Appwrite aplica permissões ao utilizador da sessão.
 */
async function uploadImageMultipart(localUri, fileName, mimeType, label) {
  if (!localUri || !BUCKET_AVATARS_ID) return null;
  const client = getAppwriteClient();
  if (!client) return null;
  ensureClientSession(client);
  const sessionSecret =
    client.headers['X-Appwrite-Session'] || client.config.session;
  if (!sessionSecret) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn(`[${label}] sem sessão Appwrite no cliente (upload ignorado).`);
    }
    return null;
  }

  const type = mimeType && String(mimeType).trim() ? mimeType : 'image/jpeg';
  const fileId = ID.unique();
  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', {
    uri: localUri,
    name: fileName || 'image.jpg',
    type,
  });

  const base = APPWRITE_ENDPOINT_CONFIG.replace(/\/$/, '');
  const url = `${base}/storage/buckets/${BUCKET_AVATARS_ID}/files`;
  const res = await fetch(url, {
    method: 'POST',
    headers: sessionHeaders(client),
    body: formData,
    credentials: 'include',
  });
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (_) {
    data = { message: text };
  }
  if (!res.ok) {
    logUploadFailure(label, res, text, data);
    return null;
  }
  return data.$id || null;
}

/**
 * Upload da foto de perfil (URI local do expo-image-picker) via API REST.
 * O SDK Web exige File; no React Native usamos FormData com { uri, name, type }.
 *
 * @param {string} [mimeType] — ex.: asset.mimeType do expo-image-picker
 * @param {string} [fileName] — ex.: asset.fileName
 */
export async function uploadAvatarFromUri(localUri, userId, mimeType, fileName) {
  if (!localUri || !userId || !BUCKET_AVATARS_ID) return null;
  const name = fileName || 'avatar.jpg';
  const sdkId = await tryStorageCreateFile(
    BUCKET_AVATARS_ID,
    localUri,
    name,
    mimeType,
    userId,
  );
  if (sdkId) return sdkId;
  return uploadImageMultipart(localUri, name, mimeType, 'uploadAvatarFromUri');
}

/**
 * Imagem de destaque da célula — bucket EXPO_PUBLIC_APPWRITE_BUCKET_AVATARES (BUCKET_AVATARS_ID).
 *
 * @param {string} [mimeType]
 * @param {string} [fileName]
 */
export async function uploadCelulaDestaqueFromUri(
  localUri,
  celulaId,
  userId,
  mimeType,
  fileName,
) {
  if (!localUri || !celulaId || !userId || !BUCKET_AVATARS_ID) return null;
  const name = fileName || `celula-${celulaId}.jpg`;
  const sdkId = await tryStorageCreateFile(
    BUCKET_AVATARS_ID,
    localUri,
    name,
    mimeType,
    userId,
  );
  if (sdkId) return sdkId;
  return uploadImageMultipart(
    localUri,
    name,
    mimeType,
    'uploadCelulaDestaqueFromUri',
  );
}
