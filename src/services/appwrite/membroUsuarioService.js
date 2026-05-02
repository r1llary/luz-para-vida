import { ID } from 'appwrite';
import {
  isAppwriteConfigured,
  isAppwriteDatabaseConfigured,
  getAppwriteAccount,
} from '../../lib/appwrite';
import { MEMBRO_SENHA_PADRAO } from '../../constants/membroAuth';
import {
  createUsuarioDocumentAppwrite,
  appendCelulaIdToUsuarioAppwrite,
} from './authService';
import { appendMembroUserIdToCelulaAppwrite } from './databaseService';

/**
 * Cria Auth + documento `usuarios` e acrescenta o userId em `celulas.membros[]`, sem trocar a sessão do líder.
 */
export async function registerMembroComContaAppwrite(celulaId, input) {
  if (
    !isAppwriteConfigured() ||
    !isAppwriteDatabaseConfigured() ||
    !celulaId
  ) {
    return null;
  }
  const account = getAppwriteAccount();
  if (!account) return null;

  const { nomeCompleto, email, dataNascimento, endereco } = input;

  const emailTrim = (email || '').trim();
  const nomeTrim = (nomeCompleto || '').trim();
  const userId = ID.unique();

  await account.create(
    userId,
    emailTrim,
    MEMBRO_SENHA_PADRAO,
    nomeTrim || undefined,
  );

  await createUsuarioDocumentAppwrite(userId, {
    nomeCompleto: nomeTrim,
    email: emailTrim,
    dataNascimento: dataNascimento || '',
    endereco: endereco || '',
    permissao: 'membro',
    celulas: [celulaId],
  });
  await appendCelulaIdToUsuarioAppwrite(userId, celulaId);
  await appendMembroUserIdToCelulaAppwrite(celulaId, userId);

  return userId;
}
