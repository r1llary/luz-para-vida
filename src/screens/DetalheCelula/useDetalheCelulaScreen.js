import { useEffect, useCallback, useMemo } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import { formatDateBr } from '../../utils/formatDateBr';

export { formatDateBr };

export function useDetalheCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { user } = useAuth();
  const routeCelula = params?.celula;
  const {
    celulas,
    membros: membrosGlobal,
    reunioes: reunioesGlobal,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
  } = useCelulas();

  const celula = useMemo(() => {
    if (!routeCelula?.id) return null;
    return celulas.find((c) => c.id === routeCelula.id) || routeCelula;
  }, [celulas, routeCelula]);

  const membros = useMemo(() => {
    if (!celula?.id) return [];
    return membrosGlobal.filter((m) => m.celulaId === celula.id);
  }, [celula?.id, celula, membrosGlobal]);

  const reunioes = useMemo(() => {
    if (!celula?.id) return [];
    return reunioesGlobal
      .filter((r) => r.celulaId === celula.id)
      .sort((a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
      );
  }, [celula?.id, celula, reunioesGlobal]);

  useEffect(() => {
    if (!celula?.id) return;
    fetchMembrosForCelula(celula.id);
    fetchReunioesForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula, fetchReunioesForCelula]);

  const canEditCelula = Boolean(
    celula && user?.id && celula.userId === user.id
  );

  const openMenu = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

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

  const openEditarCelula = useCallback(() => {
    if (!celula) return;
    navigation.navigate('EditarCelula', { celula });
  }, [navigation, celula]);

  return {
    celula,
    membros,
    reunioes,
    formatDateBr,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    openEditarCelula,
    openMenu,
    canEditCelula,
  };
}
