import { ID, Permission, Role } from 'appwrite';
import {
  BUCKET_AVATARS_ID,
  APPWRITE_ENDPOINT_CONFIG,
  APPWRITE_PROJECT_ID_CONFIG,
} from '../../lib/appwrite/config';
import { getAppwriteClient } from '../../lib/appwrite';

/**
 * Upload da foto de perfil (URI local do expo-image-picker) via API REST.
 * O SDK Web exige File; no React Native usamos FormData com { uri, name, type }.
 */
export async function uploadAvatarFromUri(localUri, userId) {
  if (!localUri || !BUCKET_AVATARS_ID || !userId) return null;
  const client = getAppwriteClient();
  if (!client) return null;
  const sessionSecret = client.config.session;
  if (!sessionSecret) return null;

  const fileId = ID.unique();
  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', {
    uri: localUri,
    name: 'avatar.jpg',
    type: 'image/jpeg',
  });
  [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ].forEach((p) => formData.append('permissions[]', p));

  const base = APPWRITE_ENDPOINT_CONFIG.replace(/\/$/, '');
  const url = `${base}/storage/buckets/${BUCKET_AVATARS_ID}/files`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': APPWRITE_PROJECT_ID_CONFIG,
      'X-Appwrite-Session': sessionSecret,
    },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data.$id || null;
}

/**
 * Imagem de destaque da célula — mesmo bucket das fotos de perfil.
 */
export async function uploadCelulaDestaqueFromUri(localUri, celulaId, userId) {
  if (!localUri || !BUCKET_AVATARS_ID || !celulaId || !userId) return null;
  const client = getAppwriteClient();
  if (!client) return null;
  const sessionSecret = client.config.session;
  if (!sessionSecret) return null;

  const fileId = ID.unique();
  const formData = new FormData();
  formData.append('fileId', fileId);
  formData.append('file', {
    uri: localUri,
    name: `celula-${celulaId}.jpg`,
    type: 'image/jpeg',
  });
  [
    Permission.read(Role.user(userId)),
    Permission.update(Role.user(userId)),
    Permission.delete(Role.user(userId)),
  ].forEach((p) => formData.append('permissions[]', p));

  const base = APPWRITE_ENDPOINT_CONFIG.replace(/\/$/, '');
  const url = `${base}/storage/buckets/${BUCKET_AVATARS_ID}/files`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'X-Appwrite-Project': APPWRITE_PROJECT_ID_CONFIG,
      'X-Appwrite-Session': sessionSecret,
    },
    body: formData,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return data.$id || null;
}
