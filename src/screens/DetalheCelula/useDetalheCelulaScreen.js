import { useEffect, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { DrawerActions, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import { getUsuarioByIdAppwrite } from '../../services/appwrite';
import { formatDateBr } from '../../utils/date';

export { formatDateBr };

export function useDetalheCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { canManage } = useAuth();
  const {
    getMembrosByCelula,
    fetchMembrosForCelula,
    getReunioesByCelula,
    fetchReunioesForCelula,
    removeMembro,
  } = useCelulas();

  const membros = celula ? getMembrosByCelula(celula.id) : [];
  const reunioes = celula ? getReunioesByCelula(celula.id) : [];

  const [liderNome, setLiderNome] = useState(null);

  // Recarrega membros e reuniões toda vez que a tela volta ao foco
  // (ao retornar de RegistroMembro, NovaReuniao, etc.)
  useFocusEffect(
    useCallback(() => {
      if (!celula?.id) return;
      fetchMembrosForCelula(celula.id);
      fetchReunioesForCelula(celula.id);
    }, [celula?.id, fetchMembrosForCelula, fetchReunioesForCelula])
  );

  useEffect(() => {
    if (!celula?.userId) return;
    getUsuarioByIdAppwrite(celula.userId)
      .then((u) => setLiderNome(u?.nomeCompleto ?? null))
      .catch(() => {});
  }, [celula?.userId]);

  const openMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const openRelatorio = useCallback(() => {
    if (!celula) return;
    navigation.navigate('RelatoriosTab', {
      screen: 'Relatorio',
      params: { celula },
    });
  }, [navigation, celula]);

  const openEditarCelula = useCallback(() => {
    if (!celula) return;
    navigation.navigate('EditarCelula', { celula });
  }, [navigation, celula]);

  const openMembrosCelula = useCallback(() => {
    if (!celula) return;
    navigation.navigate('MembrosCelula', { celula });
  }, [navigation, celula]);

  const openNovaReuniao = useCallback(() => {
    if (!celula) return;
    navigation.navigate('NovaReuniao', { celula });
  }, [navigation, celula]);

  const openDetalheReuniao = useCallback(
    (reuniao) => {
      navigation.navigate('DetalheReuniao', {
        reuniao,
        celulaNome: celula?.nomeCelula,
      });
    },
    [navigation, celula?.nomeCelula]
  );

  const openRegistroMembro = useCallback(() => {
    if (!celula?.id) return;
    navigation.navigate('RegistroMembro', { celulaId: celula.id });
  }, [navigation, celula?.id]);

  const confirmarRemoverMembro = useCallback(
    (membro) => {
      Alert.alert(
        'Remover membro',
        `Deseja remover ${membro.nomeCompleto} da célula?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              const ok = await removeMembro(membro.id, celula?.id);
              if (ok === false) {
                Alert.alert(
                  'Erro',
                  'Não foi possível remover o membro. Verifique sua conexão e tente novamente.'
                );
              }
            },
          },
        ]
      );
    },
    [removeMembro, celula?.id]
  );

  return {
    celula,
    liderNome,
    membros,
    reunioes,
    canManage,
    formatDateBr,
    openRelatorio,
    openEditarCelula,
    openMembrosCelula,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    confirmarRemoverMembro,
    openMenu,
  };
}
