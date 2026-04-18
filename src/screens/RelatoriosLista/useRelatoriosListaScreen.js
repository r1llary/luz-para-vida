import { useCallback, useMemo } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';
import { USE_CELULAS_LIST_MOCK } from '../../config/mockFlags';
import { CELULAS_MOCK } from '../../mocks/celulasMock';

export function useRelatoriosListaScreen() {
  const navigation = useNavigation();
  const { celulas } = useCelulas();

  const celulasExibidas = useMemo(
    () => (USE_CELULAS_LIST_MOCK ? CELULAS_MOCK : celulas),
    [celulas]
  );

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const openRelatorio = useCallback(
    (celula) => {
      navigation.navigate('Relatorio', { celula });
    },
    [navigation]
  );

  return {
    celulas: celulasExibidas,
    usandoMockLista: USE_CELULAS_LIST_MOCK,
    openDrawer,
    openRelatorio,
  };
}
