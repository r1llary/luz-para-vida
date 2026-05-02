import { updateUsuarioPermissaoAppwrite } from './appwrite/authService';

/**
 * Atualiza `permissao` nos perfis conforme líder/co-líder da célula.
 * Requer regras no Appwrite que permitam atualizar os documentos `usuarios` afetados.
 */
export async function syncPermissoesAposLideranca(prev, merged) {
  const pl = prev?.liderUserId || '';
  const pcl = prev?.coLiderUserId || '';
  const nl = merged?.liderUserId || '';
  const ncl = merged?.coLiderUserId || '';

  for (const uid of [pl, pcl]) {
    if (uid && uid !== nl && uid !== ncl) {
      await updateUsuarioPermissaoAppwrite(uid, 'membro');
    }
  }
  if (nl) {
    await updateUsuarioPermissaoAppwrite(nl, 'lider');
  }
  if (ncl && ncl !== nl) {
    await updateUsuarioPermissaoAppwrite(ncl, 'colider');
  }
}
