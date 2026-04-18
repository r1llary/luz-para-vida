import { useEffect, useMemo } from 'react';
import { useRoute } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';

function formatDateBr(iso) {
  if (!iso || typeof iso !== 'string') return '';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return String(iso);
  return `${d}/${m}/${y}`;
}

export function useDetalheReuniaoScreen() {
  const { params } = useRoute();
  const reuniao = params?.reuniao;
  const celulaNome = params?.celulaNome;
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

  return {
    reuniao,
    celulaNome,
    dataLabel,
    nomesPresentes,
    legacyCount,
  };
}
