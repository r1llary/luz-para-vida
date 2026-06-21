import { useEffect, useMemo, useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { relatorioMensalSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { formatDateBr } from '../../utils/date';

export { formatDateBr };

export function useRelatorioScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { getReunioesByCelula, fetchReunioesForCelula, getMembrosByCelula, fetchMembrosForCelula } = useCelulas();

  const initialPeriod = useMemo(() => {
    const d = new Date();
    return { ano: d.getFullYear(), mes: d.getMonth() + 1 };
  }, []);

  const { control, formState: { errors } } = useForm({
    resolver: zodResolver(relatorioMensalSchema),
    defaultValues: initialPeriod,
  });

  const ano = useWatch({ control, name: 'ano' });
  const mes = useWatch({ control, name: 'mes' });

  useEffect(() => {
    if (celula?.id) {
      fetchReunioesForCelula(celula.id);
      fetchMembrosForCelula(celula.id);
    }
  }, [celula?.id, fetchReunioesForCelula, fetchMembrosForCelula]);

  const todas = celula ? getReunioesByCelula(celula.id) : [];
  const membros = celula ? getMembrosByCelula(celula.id) : [];

  const filtradas = useMemo(() => {
    if (!celula || ano == null || mes == null) return [];
    const yNum = Number(ano);
    const mNum = Number(mes);
    if (!Number.isFinite(yNum) || !Number.isFinite(mNum)) return [];
    return todas
      .filter((r) => {
        const dr = r.dataReuniao;
        if (!dr || typeof dr !== 'string') return false;
        const parts = dr.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        return y === yNum && m === mNum;
      })
      .sort((a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
      );
  }, [todas, ano, mes, celula]);

  const totais = useMemo(
    () => ({
      reunioes: filtradas.length,
      visitantes: filtradas.reduce(
        (s, r) => s + (Number(r.visitantes) || 0),
        0
      ),
      membrosPresentes: filtradas.reduce((s, r) => {
        const ids = r.membrosPresentesIds;
        const n =
          Array.isArray(ids) && ids.length > 0
            ? ids.length
            : Number(r.membrosPresentes) || 0;
        return s + n;
      }, 0),
    }),
    [filtradas]
  );

  const frequencia = useMemo(() => {
    if (!membros.length) return [];
    const reunioesComIds = filtradas.filter(
      (r) => Array.isArray(r.membrosPresentesIds) && r.membrosPresentesIds.length > 0
    );
    if (!reunioesComIds.length) return [];
    return membros
      .map((m) => {
        const presencas = reunioesComIds.filter((r) =>
          r.membrosPresentesIds.includes(m.id)
        ).length;
        return {
          id: m.id,
          nome: m.nomeCompleto,
          presencas,
          total: reunioesComIds.length,
          pct: presencas / reunioesComIds.length,
        };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [filtradas, membros]);

  const openReuniao = useCallback(
    (reuniao) => {
      navigation.navigate('CelulasTab', {
        screen: 'DetalheReuniao',
        params: {
          reuniao,
          celulaNome: celula?.nomeCelula,
        },
      });
    },
    [navigation, celula?.nomeCelula]
  );

  return {
    celula,
    control,
    errors,
    filtradas,
    totais,
    frequencia,
    formatDateBr,
    openReuniao,
    initialPeriod,
  };
}
