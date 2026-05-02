import { useEffect, useMemo, useCallback } from 'react';
import { Alert } from 'react-native';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { relatorioMensalSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { filterCelulasParaRelatorio } from '../../utils/celulaRelatorio';
import { formatDateBr } from '../../utils/formatDateBr';
import {
  computeFrequenciaStats,
  computeTotaisResumo,
} from '../../utils/relatorioFrequenciaStats';
import { buildRelatorioPdfHtml } from '../../utils/relatorioPdfHtml';
import { shareRelatorioPdf } from '../../utils/shareRelatorioPdf';

export { formatDateBr };

export function useRelatorioScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { user } = useAuth();
  const celula = params?.celula;
  const todasCelulas = params?.todasCelulas === true;
  const periodoInicio = params?.periodoInicio;
  const periodoFim = params?.periodoFim;

  const {
    celulas,
    reunioes: reunioesGlobal,
    membros: membrosGlobal,
    getReunioesByCelula,
    fetchReunioesForCelula,
    fetchMembrosForCelula,
  } = useCelulas();

  const elegiveis = useMemo(
    () => filterCelulasParaRelatorio(celulas, user?.id),
    [celulas, user?.id],
  );

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

  const usaPeriodoDaLista =
    typeof periodoInicio === 'string' &&
    typeof periodoFim === 'string' &&
    periodoInicio.length >= 10 &&
    periodoFim.length >= 10;

  const periodoOrdenado = useMemo(() => {
    if (!usaPeriodoDaLista) return { inicio: '', fim: '' };
    let a = periodoInicio;
    let b = periodoFim;
    if (a > b) [a, b] = [b, a];
    return { inicio: a, fim: b };
  }, [usaPeriodoDaLista, periodoInicio, periodoFim]);

  useEffect(() => {
    if (todasCelulas) {
      elegiveis.forEach((c) => {
        fetchMembrosForCelula(c.id);
        fetchReunioesForCelula(c.id);
      });
      return;
    }
    if (celula?.id) {
      fetchMembrosForCelula(celula.id);
      fetchReunioesForCelula(celula.id);
    }
  }, [
    todasCelulas,
    celula?.id,
    elegiveis,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
  ]);

  const todasFonte = useMemo(() => {
    if (todasCelulas) {
      const ids = new Set(elegiveis.map((c) => c.id));
      return reunioesGlobal.filter((r) => ids.has(r.celulaId));
    }
    if (celula?.id) return getReunioesByCelula(celula.id);
    return [];
  }, [
    todasCelulas,
    elegiveis,
    reunioesGlobal,
    celula?.id,
    getReunioesByCelula,
  ]);

  const filtradas = useMemo(() => {
    if (!todasCelulas && !celula?.id) return [];
    if (usaPeriodoDaLista) {
      let a = periodoOrdenado.inicio;
      let b = periodoOrdenado.fim;
      return todasFonte
        .filter((r) => {
          const dr = r.dataReuniao || r.data;
          if (!dr || typeof dr !== 'string') return false;
          return dr >= a && dr <= b;
        })
        .sort((x, y) =>
          String(y.dataReuniao || '').localeCompare(String(x.dataReuniao || '')),
        );
    }
    if (ano == null || mes == null) return [];
    const yNum = Number(ano);
    const mNum = Number(mes);
    if (!Number.isFinite(yNum) || !Number.isFinite(mNum)) return [];
    return todasFonte
      .filter((r) => {
        const dr = r.dataReuniao || r.data;
        if (!dr || typeof dr !== 'string') return false;
        const parts = dr.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10);
        return y === yNum && m === mNum;
      })
      .sort((a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || '')),
      );
  }, [
    todasFonte,
    ano,
    mes,
    celula,
    todasCelulas,
    usaPeriodoDaLista,
    periodoOrdenado.inicio,
    periodoOrdenado.fim,
  ]);

  const membrosListaLen = useMemo(() => {
    if (todasCelulas || !celula?.id) return 0;
    return membrosGlobal.filter((m) => m.celulaId === celula.id).length;
  }, [todasCelulas, celula?.id, membrosGlobal]);

  const frequenciaStats = useMemo(() => {
    if (!usaPeriodoDaLista) return null;
    const noPeriodo = todasFonte.filter((r) => {
      const dr = r.dataReuniao || r.data;
      if (!dr || typeof dr !== 'string') return false;
      return (
        dr >= periodoOrdenado.inicio && dr <= periodoOrdenado.fim
      );
    });
    return computeFrequenciaStats({
      isTodasCelulas: todasCelulas,
      elegiveis,
      membrosGlobal,
      membrosListaLength: membrosListaLen,
      reunioesNoPeriodo: noPeriodo,
    });
  }, [
    usaPeriodoDaLista,
    todasFonte,
    periodoOrdenado.inicio,
    periodoOrdenado.fim,
    todasCelulas,
    elegiveis,
    membrosGlobal,
    membrosListaLen,
  ]);

  const totais = useMemo(() => computeTotaisResumo(filtradas), [filtradas]);

  const nomeCelulaPorId = useMemo(() => {
    const m = new Map();
    elegiveis.forEach((c) => m.set(c.id, c.nomeCelula));
    return m;
  }, [elegiveis]);

  const gruposPorCelula = useMemo(() => {
    if (!todasCelulas || !filtradas.length) return null;
    const by = new Map();
    filtradas.forEach((r) => {
      const cid = r.celulaId;
      if (!by.has(cid)) by.set(cid, []);
      by.get(cid).push(r);
    });
    return Array.from(by.entries())
      .map(([cid, arr]) => ({
        celulaId: cid,
        nomeCelula: nomeCelulaPorId.get(cid) || cid,
        reunioes: arr.sort((a, b) =>
          String(a.dataReuniao || a.data || '').localeCompare(
            String(b.dataReuniao || b.data || ''),
          ),
        ),
      }))
      .sort((a, b) =>
        String(a.nomeCelula).localeCompare(String(b.nomeCelula), 'pt-BR'),
      );
  }, [todasCelulas, filtradas, nomeCelulaPorId]);

  const gruposPdf = useMemo(() => {
    if (!filtradas.length) return [];
    if (!todasCelulas && celula) {
      return [
        {
          nomeCelula: celula.nomeCelula || '—',
          reunioes: [...filtradas].sort((a, b) =>
            String(a.dataReuniao || a.data || '').localeCompare(
              String(b.dataReuniao || b.data || ''),
            ),
          ),
        },
      ];
    }
    if (gruposPorCelula) {
      return gruposPorCelula.map((g) => ({
        nomeCelula: g.nomeCelula,
        reunioes: g.reunioes,
      }));
    }
    return [];
  }, [filtradas, todasCelulas, celula, gruposPorCelula]);

  const celulaTitulo = todasCelulas
    ? 'Todas as células (consolidado)'
    : celula?.nomeCelula ?? '—';

  const openReuniao = useCallback(
    (reuniao) => {
      const nome =
        nomeCelulaPorId.get(reuniao.celulaId) ||
        celula?.nomeCelula ||
        '—';
      navigation.navigate('CelulasTab', {
        screen: 'DetalheReuniao',
        params: {
          reuniao,
          celulaNome: nome,
        },
      });
    },
    [navigation, nomeCelulaPorId, celula?.nomeCelula],
  );

  const gerarPdfRelatorio = useCallback(async () => {
    if (!filtradas.length) {
      Alert.alert(
        'Relatório',
        'Não há reuniões neste período para exportar.',
      );
      return;
    }
    if (!frequenciaStats || !usaPeriodoDaLista) {
      Alert.alert('Relatório', 'Período inválido para o PDF.');
      return;
    }
    try {
      const html = buildRelatorioPdfHtml({
        periodoOrdenado,
        filtroLabel: celulaTitulo,
        grupos: gruposPdf,
        stats: frequenciaStats,
      });
      await shareRelatorioPdf(html);
    } catch (_) {
      /* shareRelatorioPdf já alerta */
    }
  }, [
    filtradas.length,
    frequenciaStats,
    usaPeriodoDaLista,
    periodoOrdenado,
    celulaTitulo,
    gruposPdf,
  ]);

  const podeMostrar = Boolean(celula || todasCelulas);

  return {
    celula,
    todasCelulas,
    celulaTitulo,
    podeMostrar,
    control,
    errors,
    filtradas,
    gruposPorCelula,
    totais,
    frequenciaStats,
    formatDateBr,
    openReuniao,
    gerarPdfRelatorio,
    initialPeriod,
    usaPeriodoDaLista,
    periodoInicio,
    periodoFim,
    periodoOrdenado,
  };
}
