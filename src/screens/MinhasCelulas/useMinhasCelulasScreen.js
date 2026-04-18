import { useCallback, useMemo } from 'react';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import { USE_CELULAS_LIST_MOCK } from '../../config/mockFlags';
import { CELULAS_MOCK } from '../../mocks/celulasMock';

export function useMinhasCelulasScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { celulas } = useCelulas();

  const celulasExibidas = useMemo(
    () => (USE_CELULAS_LIST_MOCK ? CELULAS_MOCK : celulas),
    [celulas]
  );

  const handleCadastrar = useCallback(() => {
    navigation.navigate('RegistroCelula');
  }, [navigation]);

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const openDetalheCelula = useCallback(
    (celula) => {
      navigation.navigate('DetalheCelula', { celula });
    },
    [navigation]
  );

  return {
    user,
    celulas: celulasExibidas,
    usandoMockLista: USE_CELULAS_LIST_MOCK,
    handleCadastrar,
    openDrawer,
    openDetalheCelula,
  };
}
