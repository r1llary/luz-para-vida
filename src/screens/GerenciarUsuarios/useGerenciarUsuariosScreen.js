import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { listAllUsersAppwrite, updateUserPermissaoAppwrite } from '../../services/appwrite';
import { useAuth } from '../../contexts/AuthContext';

export function useGerenciarUsuariosScreen() {
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listAllUsersAppwrite();
      setUsuarios(list);
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { carregar(); }, [carregar]);

  const alterarPermissao = useCallback(async (userId, novaPermissao) => {
    if (userId === currentUser?.id) {
      Alert.alert('Atenção', 'Você não pode alterar sua própria permissão.');
      return;
    }
    setUpdatingId(userId);
    try {
      await updateUserPermissaoAppwrite(userId, novaPermissao);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, permissao: novaPermissao } : u))
      );
    } catch (_) {
      Alert.alert('Erro', 'Não foi possível alterar a permissão.');
    } finally {
      setUpdatingId(null);
    }
  }, [currentUser?.id]);

  return { usuarios, loading, updatingId, currentUserId: currentUser?.id, alterarPermissao, carregar };
}
