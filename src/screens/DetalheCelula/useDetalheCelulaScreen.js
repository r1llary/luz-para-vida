import { useEffect, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';

export function useDetalheCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { getMembrosByCelula, fetchMembrosForCelula } = useCelulas();

  const membros = celula ? getMembrosByCelula(celula.id) : [];

  useEffect(() => {
    if (celula?.id) fetchMembrosForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula]);

  const openRelatorio = useCallback(() => {
    if (!celula) return;
    navigation.navigate('Relatorio', { celula });
  }, [navigation, celula]);

  const openRegistroMembro = useCallback(() => {
    if (!celula?.id) return;
    navigation.navigate('RegistroMembro', { celulaId: celula.id });
  }, [navigation, celula?.id]);

  return {
    celula,
    membros,
    openRelatorio,
    openRegistroMembro,
  };
}
