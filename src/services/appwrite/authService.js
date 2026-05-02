import { ID } from 'appwrite';
import {
  isAppwriteConfigured,
  getAppwriteAccount,
  getAppwriteClient,
  getAppwriteDatabases,
  getAppwriteStorage,
  resetAppwriteClients,
  DATABASE_ID,
  COLLECTION_IDS,
  BUCKET_AVATARS_ID,
} from '../../lib/appwrite';
import { uploadAvatarFromUri } from './storageAvatar';

const PERMISSOES = ['membro', 'admin', 'lider', 'colider'];

export { PERMISSOES };

/** Valor gravado em Appwrite (`permissao` como array de strings). */
export function permissaoToAppwriteArray(value) {
  if (Array.isArray(value)) {
    const filtered = value.map(String).filter((p) => PERMISSOES.includes(p));
    return filtered.length > 0 ? filtered : ['membro'];
  }
  const s = typeof value === 'string' ? value : 'membro';
  return PERMISSOES.includes(s) ? [s] : ['membro'];
}

/** String única para o app (primeiro papel válido no documento). */
export function parsePermissaoFromUsuarioDoc(doc) {
  if (!doc) return 'membro';
  const raw = doc.permissao;
  if (Array.isArray(raw)) {
    const first = raw.map(String).find((p) => PERMISSOES.includes(p));
    return first || 'membro';
  }
  if (typeof raw === 'string' && PERMISSOES.includes(raw)) return raw;
  return 'membro';
}

/**
 * Lê `celulas` do documento Appwrite (array nativo ou string JSON legada).
 * @param {object} [doc]
 * @returns {string[]}
 */
export function parseCelulasFromUsuarioDoc(doc) {
  if (!doc) return [];
  const raw = doc.celulas;
  if (Array.isArray(raw)) return raw.filter(Boolean).map(String);
  if (typeof raw === 'string' && raw.trim()) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(String);
    } catch (_) {
      return [raw.trim()];
    }
  }
  return [];
}

/**
 * Acrescenta um ID de célula ao array `celulas` do documento usuário (sem duplicar).
 */
export async function appendCelulaIdToUsuarioAppwrite(userId, celulaId) {
  if (!isAppwriteConfigured() || !userId || !celulaId) return;
  const databases = getAppwriteDatabases();
  if (!databases || !DATABASE_ID || !COLLECTION_IDS.usuarios) return;
  try {
    const doc = await databases.getDocument(
      DATABASE_ID,
      COLLECTION_IDS.usuarios,
      userId,
    );
    const existing = parseCelulasFromUsuarioDoc(doc);
    if (existing.includes(celulaId)) return;
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.usuarios,
      userId,
      { celulas: [...existing, celulaId] },
    );
  } catch (_) {
    /* permissões / doc inexistente / atributo ausente */
  }
}

function applySessionFromResponse(session) {
  const client = getAppwriteClient();
  if (!client) return;
  if (session?.secret) {
    client.setSession(session.secret);
    return;
  }
  try {
    const raw =
      typeof globalThis !== 'undefined' && globalThis.localStorage
        ? globalThis.localStorage.getItem('cookieFallback')
        : null;
    if (raw) {
      const cookie = JSON.parse(raw);
      const sid = cookie[`a_session_${client.config.project}`];
      if (sid) client.setSession(sid);
    }
  } catch (_) {
    /* noop */
  }
}

function clearCookieFallback() {
  try {
    if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
      globalThis.localStorage.removeItem('cookieFallback');
    }
  } catch (_) {
    /* noop */
  }
}

/**
 * Restaura X-Appwrite-Session a partir do cookieFallback (útil após reload do app / Expo).
 */
export function restoreAppwriteSessionFromStorage() {
  const client = getAppwriteClient();
  if (!client) return;
  if (client.config.session) return;
  try {
    const raw =
      typeof globalThis !== 'undefined' && globalThis.localStorage
        ? globalThis.localStorage.getItem('cookieFallback')
        : null;
    if (raw) {
      const cookie = JSON.parse(raw);
      const sid = cookie[`a_session_${client.config.project}`];
      if (sid) client.setSession(sid);
    }
  } catch (_) {
    /* noop */
  }
}

/**
 * URL para exibir a imagem do Storage (preview). Requer sessão ou permissões no arquivo.
 */
export function getAvatarViewUrl(fileId) {
  if (!fileId || !BUCKET_AVATARS_ID) return null;
  const storage = getAppwriteStorage();
  if (!storage) return null;
  return storage.getFileView(BUCKET_AVATARS_ID, fileId);
}

/**
 * Autenticação via Appwrite.
 */

export async function signInWithAppwrite(email, senha) {
  if (!isAppwriteConfigured()) return null;
  const account = getAppwriteAccount();
  if (!account) return null;
  const session = await account.createEmailPasswordSession(email, senha);
  applySessionFromResponse(session);
  return getCurrentUserFromAppwrite();
}

/**
 * @param {object} profile
 * @param {string} profile.nomeCompleto
 * @param {string} profile.email
 * @param {string} profile.senha
 * @param {string} profile.dataNascimento ISO YYYY-MM-DD
 * @param {string} profile.endereco
 * @param {string} [profile.fotoUri] URI local da imagem (expo-image-picker)
 */
export async function signUpWithAppwrite(profile) {
  if (!isAppwriteConfigured()) return null;
  const {
    nomeCompleto,
    email,
    senha,
    dataNascimento,
    endereco,
    fotoUri,
  } = profile;

  const account = getAppwriteAccount();
  if (!account) return null;

  const userId = ID.unique();
  await account.create(userId, email, senha, nomeCompleto || undefined);

  const session = await account.createEmailPasswordSession(email, senha);
  applySessionFromResponse(session);

  let fotoPerfilId = '';
  if (fotoUri && BUCKET_AVATARS_ID) {
    try {
      const id = await uploadAvatarFromUri(fotoUri, userId);
      if (id) fotoPerfilId = id;
    } catch (_) {
      /* cadastro segue sem foto */
    }
  }

  await createUsuarioDocumentAppwrite(userId, {
    nomeCompleto,
    email,
    dataNascimento,
    endereco,
    fotoPerfil: fotoPerfilId,
    permissao: ['membro'],
    celulas: [],
  });

  return getCurrentUserFromAppwrite();
}

/**
 * Cria o documento `usuarios` para um Auth userId (cadastro próprio ou membro convidado).
 */
export async function createUsuarioDocumentAppwrite(userId, fields) {
  if (!isAppwriteConfigured() || !userId) return;
  const databases = getAppwriteDatabases();
  if (!databases || !DATABASE_ID || !COLLECTION_IDS.usuarios) return;
  const {
    nomeCompleto,
    email,
    dataNascimento,
    endereco,
    fotoPerfil = '',
    permissao = 'membro',
    celulas = [],
  } = fields;
  const baseDoc = {
    userId,
    nomeCompleto: nomeCompleto || '',
    email: (email || '').trim(),
    dataNascimento: dataNascimento || '',
    endereco: endereco || '',
    fotoPerfil: fotoPerfil || '',
    permissao: permissaoToAppwriteArray(permissao),
  };
  try {
    await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.usuarios,
      userId,
      { ...baseDoc, celulas },
    );
  } catch (firstErr) {
    try {
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_IDS.usuarios,
        userId,
        baseDoc,
      );
    } catch {
      throw firstErr;
    }
  }
}

/**
 * Atualiza apenas `permissao` no documento usuarios (ex.: líder / co-líder da célula).
 * Requer regras no Appwrite que permitam a escrita no documento alvo.
 */
export async function updateUsuarioPermissaoAppwrite(userId, permissao) {
  if (!isAppwriteConfigured() || !userId) return;
  if (!PERMISSOES.includes(permissao)) return;
  const databases = getAppwriteDatabases();
  if (!databases || !DATABASE_ID || !COLLECTION_IDS.usuarios) return;
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.usuarios,
      userId,
      { permissao: permissaoToAppwriteArray(permissao) },
    );
  } catch (_) {
    /* permissões do console ou doc inexistente */
  }
}

/**
 * Atualiza perfil (Appwrite Account + documento usuarios + foto opcional).
 * Requer senha atual ao alterar email ou senha de acesso.
 *
 * @param {object} payload
 * @param {string} payload.nomeCompleto
 * @param {string} payload.dataNascimento
 * @param {string} payload.endereco
 * @param {string} payload.email
 * @param {string} [payload.fotoUri]
 * @param {string} [payload.novaSenha]
 * @param {string} [payload.senhaAtual]
 * @param {object} currentUser usuário atual do contexto (id, email, fotoPerfil, …)
 */
export async function updateProfileInAppwrite(payload, currentUser) {
  if (!isAppwriteConfigured() || !currentUser?.id) return null;
  const account = getAppwriteAccount();
  const databases = getAppwriteDatabases();
  if (!account) return null;

  const userId = currentUser.id;
  const {
    nomeCompleto,
    dataNascimento,
    endereco,
    email,
    fotoUri,
    removeFoto,
    novaSenha,
    senhaAtual,
  } = payload;

  const emailTrim = (email || '').trim();
  const emailChanged =
    emailTrim.toLowerCase() !==
    (currentUser.email || '').trim().toLowerCase();
  const passwordChange = !!(novaSenha && String(novaSenha).length >= 6);

  if (emailChanged || passwordChange) {
    const s = senhaAtual != null ? String(senhaAtual).trim() : '';
    if (!s) {
      throw new Error(
        'Informe sua senha atual para alterar email ou senha.'
      );
    }
  }

  if (emailChanged) {
    await account.updateEmail(emailTrim, senhaAtual);
  }

  if (passwordChange) {
    await account.updatePassword(novaSenha, senhaAtual);
  }

  const nameTrim = (nomeCompleto || '').trim();
  if (nameTrim) {
    await account.updateName(nameTrim);
  }

  let fotoPerfilId = currentUser.fotoPerfil || '';
  if (removeFoto) {
    fotoPerfilId = '';
  } else if (fotoUri && BUCKET_AVATARS_ID) {
    try {
      const id = await uploadAvatarFromUri(fotoUri, userId);
      if (id) fotoPerfilId = id;
    } catch (_) {
      /* mantém foto anterior */
    }
  }

  if (databases && DATABASE_ID && COLLECTION_IDS.usuarios) {
    const docPayload = {
      nomeCompleto: nameTrim,
      email: emailTrim,
      dataNascimento: (dataNascimento || '').trim(),
      endereco: (endereco || '').trim(),
      fotoPerfil: fotoPerfilId || '',
    };
    try {
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.usuarios,
        userId,
        docPayload,
      );
    } catch (_) {
      try {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.usuarios,
          userId,
          {
            userId,
            ...docPayload,
            permissao: ['membro'],
            celulas: [],
          },
        );
      } catch {
        await databases.createDocument(
          DATABASE_ID,
          COLLECTION_IDS.usuarios,
          userId,
          {
            userId,
            ...docPayload,
            permissao: ['membro'],
          },
        );
      }
    }
  }

  return getCurrentUserFromAppwrite();
}

export async function signOutFromAppwrite() {
  if (!isAppwriteConfigured()) return;
  const account = getAppwriteAccount();
  if (account) {
    try {
      await account.deleteSession('current');
    } catch (_) {
      try {
        await account.deleteSessions();
      } catch (_) {
        /* noop */
      }
    }
  }
  const client = getAppwriteClient();
  if (client) {
    client.setSession('');
  }
  clearCookieFallback();
  resetAppwriteClients();
}

export async function getCurrentUserFromAppwrite() {
  if (!isAppwriteConfigured()) return null;
  const account = getAppwriteAccount();
  const databases = getAppwriteDatabases();
  if (!account) return null;
  try {
    const user = await account.get();
    let nomeCompleto = user.name || user.email || '';
    let dataNascimento = '';
    let endereco = '';
    let fotoPerfil = '';
    let fotoPerfilUrl = null;
    let permissao = 'membro';
    let celulas = [];

    if (databases && DATABASE_ID && COLLECTION_IDS.usuarios) {
      try {
        const doc = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_IDS.usuarios,
          user.$id,
        );
        if (doc?.nomeCompleto) nomeCompleto = doc.nomeCompleto;
        if (doc?.dataNascimento) dataNascimento = doc.dataNascimento;
        if (doc?.endereco) endereco = doc.endereco;
        if (doc?.fotoPerfil) {
          fotoPerfil = doc.fotoPerfil;
          fotoPerfilUrl = getAvatarViewUrl(doc.fotoPerfil);
        }
        celulas = parseCelulasFromUsuarioDoc(doc);
        permissao = parsePermissaoFromUsuarioDoc(doc);
      } catch (_) {
        /* sem documento de perfil */
      }
    }

    return {
      id: user.$id,
      email: user.email,
      nomeCompleto: nomeCompleto || user.email,
      dataNascimento,
      endereco,
      fotoPerfil,
      fotoPerfilUrl,
      permissao,
      celulas,
    };
  } catch {
    return null;
  }
}
