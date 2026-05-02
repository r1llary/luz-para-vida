import { useCallback, useState, useEffect } from 'react';
import { DrawerActions, useFocusEffect } from '@react-navigation/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';

export function useMinhasCelulasScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { celulas, refreshCelulas } = useCelulas();
  const [novaCelulaOpen, setNovaCelulaOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refreshCelulas();
    }, [refreshCelulas])
  );

  useEffect(() => {
    if (route.params?.openNovaCelula) {
      setNovaCelulaOpen(true);
      navigation.setParams({ openNovaCelula: undefined });
    }
  }, [route.params?.openNovaCelula, navigation]);

  const handleCadastrar = useCallback(() => setNovaCelulaOpen(true), []);

  const closeNovaCelula = useCallback(() => setNovaCelulaOpen(false), []);

  const onNovaCelulaCreated = useCallback(
    (celula) => {
      setNovaCelulaOpen(false);
      navigation.navigate('DetalheCelula', { celula });
    },
    [navigation]
  );

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
    celulas,
    handleCadastrar,
    openDrawer,
    openDetalheCelula,
    novaCelulaOpen,
    closeNovaCelula,
    onNovaCelulaCreated,
  };
}
