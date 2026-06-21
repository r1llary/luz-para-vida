import { useEffect, useMemo, useCallback } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatDateBr } from '../../utils/date';

export function useDetalheReuniaoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const reuniao = params?.reuniao;
  const celulaNome = params?.celulaNome;
  const { canManage } = useAuth();
  const { fetchMembrosForCelula, getMembrosByCelula } = useCelulas();

  useEffect(() => {
    if (reuniao?.celulaId) fetchMembrosForCelula(reuniao.celulaId);
  }, [reuniao?.celulaId, fetchMembrosForCelula]);

  const membrosCatalogo = reuniao?.celulaId
    ? getMembrosByCelula(reuniao.celulaId)
    : [];

  const nomesPresentes = useMemo(() => {
    const ids = reuniao?.membrosPresentesIds;
    if (!Array.isArray(ids) || ids.length === 0) return [];
    return ids.map((id) => {
      const m = membrosCatalogo.find((x) => x.id === id);
      return m?.nomeCompleto ?? 'Membro não encontrado na lista atual';
    });
  }, [reuniao?.membrosPresentesIds, membrosCatalogo]);

  const dataLabel = reuniao?.dataReuniao
    ? formatDateBr(reuniao.dataReuniao)
    : '';

  const legacyCount = Number(reuniao?.membrosPresentes) || 0;

  const visitantesDetalhes = Array.isArray(reuniao?.visitantesDetalhes)
    ? reuniao.visitantesDetalhes.filter((v) => v?.nome)
    : [];

  const openEditar = useCallback(() => {
    if (!reuniao || !canManage) return;
    navigation.navigate('EditarReuniao', {
      reuniao,
      celula: { id: reuniao.celulaId, nomeCelula: celulaNome },
    });
  }, [navigation, reuniao, celulaNome, canManage]);

  return {
    reuniao,
    celulaNome,
    dataLabel,
    nomesPresentes,
    legacyCount,
    visitantesDetalhes,
    canManage,
    openEditar,
  };
}
