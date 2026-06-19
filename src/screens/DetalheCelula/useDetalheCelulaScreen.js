import { useEffect, useCallback } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';

export function formatDateBr(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

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
  } = useCelulas();

  const membros = celula ? getMembrosByCelula(celula.id) : [];
  const reunioes = celula ? getReunioesByCelula(celula.id) : [];

  useEffect(() => {
    if (!celula?.id) return;
    fetchMembrosForCelula(celula.id);
    fetchReunioesForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula, fetchReunioesForCelula]);

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

  return {
    celula,
    membros,
    reunioes,
    canManage,
    formatDateBr,
    openRelatorio,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    openMenu,
  };
}
