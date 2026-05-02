import { useCallback, useEffect, useMemo, useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Alert, Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import { CELULA_RELATORIO_TODAS_ID } from '../../constants/relatorio';
import { filterCelulasParaRelatorio } from '../../utils/celulaRelatorio';
import { formatIsoDateBr, localDateToIso, todayIsoDate } from '../../utils/brFormat';
import { buildRelatorioPdfHtml } from '../../utils/relatorioPdfHtml';
import { shareRelatorioPdf } from '../../utils/shareRelatorioPdf';
import { computeFrequenciaStats } from '../../utils/relatorioFrequenciaStats';

function monthBoundsIso() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    inicio: localDateToIso(start),
    fim: localDateToIso(end),
  };
}

export function useRelatoriosListaScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const {
    celulas,
    membros: membrosGlobal,
    reunioes: reunioesGlobal,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
  } = useCelulas();

  const bounds = useMemo(() => monthBoundsIso(), []);

  const [dataInicio, setDataInicio] = useState(bounds.inicio);
  const [dataFim, setDataFim] = useState(bounds.fim);
  const [selectedCelulaId, setSelectedCelulaId] = useState(null);
  const [celulaPickerOpen, setCelulaPickerOpen] = useState(false);
  const [activeDateField, setActiveDateField] = useState(null);
  const [showAndroidDatePicker, setShowAndroidDatePicker] = useState(false);
  const [iosDateModalOpen, setIosDateModalOpen] = useState(false);

  const elegiveis = useMemo(
    () => filterCelulasParaRelatorio(celulas, user?.id),
    [celulas, user?.id]
  );

  const pickerItems = useMemo(
    () => [
      {
        id: CELULA_RELATORIO_TODAS_ID,
        nomeCelula: 'Todas as células (consolidado)',
      },
      ...elegiveis,
    ],
    [elegiveis]
  );

  useEffect(() => {
    if (!elegiveis.length) {
      setSelectedCelulaId(null);
      return;
    }
    setSelectedCelulaId((prev) => {
      if (prev === CELULA_RELATORIO_TODAS_ID) return prev;
      if (prev && elegiveis.some((c) => c.id === prev)) return prev;
      return elegiveis[0].id;
    });
  }, [elegiveis]);

  const selectedCelula = useMemo(
    () => elegiveis.find((c) => c.id === selectedCelulaId) || null,
    [elegiveis, selectedCelulaId]
  );

  const isTodasCelulas = selectedCelulaId === CELULA_RELATORIO_TODAS_ID;

  const selectedCelulaLabel = useMemo(() => {
    if (isTodasCelulas) return 'Todas as células (consolidado)';
    return selectedCelula?.nomeCelula ?? '—';
  }, [isTodasCelulas, selectedCelula?.nomeCelula]);

  useEffect(() => {
    if (!selectedCelulaId) return;
    if (isTodasCelulas) {
      elegiveis.forEach((c) => {
        fetchMembrosForCelula(c.id);
        fetchReunioesForCelula(c.id);
      });
      return;
    }
    fetchMembrosForCelula(selectedCelulaId);
    fetchReunioesForCelula(selectedCelulaId);
  }, [
    selectedCelulaId,
    isTodasCelulas,
    elegiveis,
    fetchMembrosForCelula,
    fetchReunioesForCelula,
  ]);

  const membrosLista = useMemo(() => {
    if (!selectedCelulaId || isTodasCelulas) return [];
    return membrosGlobal.filter((m) => m.celulaId === selectedCelulaId);
  }, [selectedCelulaId, isTodasCelulas, membrosGlobal]);

  const reunioesCelula = useMemo(() => {
    if (!selectedCelulaId) return [];
    const idsSet = new Set(elegiveis.map((c) => c.id));

    if (isTodasCelulas) {
      return [...reunioesGlobal.filter((r) => idsSet.has(r.celulaId))].sort(
        (a, b) =>
          String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
      );
    }

    return [...reunioesGlobal.filter((r) => r.celulaId === selectedCelulaId)].sort(
      (a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
    );
  }, [selectedCelulaId, isTodasCelulas, reunioesGlobal, elegiveis]);

  const periodoOrdenado = useMemo(() => {
    let a = dataInicio;
    let b = dataFim;
    if (a && b && a > b) [a, b] = [b, a];
    return { inicio: a, fim: b };
  }, [dataInicio, dataFim]);

  const reunioesNoPeriodo = useMemo(() => {
    const { inicio, fim } = periodoOrdenado;
    if (!inicio || !fim) return [];
    return reunioesCelula.filter((r) => {
      const dr = r.dataReuniao || r.data;
      if (!dr || typeof dr !== 'string') return false;
      return dr >= inicio && dr <= fim;
    });
  }, [reunioesCelula, periodoOrdenado]);

  const frequenciaStats = useMemo(
    () =>
      computeFrequenciaStats({
        isTodasCelulas,
        elegiveis,
        membrosGlobal,
        membrosListaLength: membrosLista.length,
        reunioesNoPeriodo,
      }),
    [
      isTodasCelulas,
      elegiveis,
      membrosGlobal,
      membrosLista.length,
      reunioesNoPeriodo,
    ],
  );

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const gruposPdf = useMemo(() => {
    if (!reunioesNoPeriodo.length) return [];
    if (!isTodasCelulas && selectedCelula) {
      return [
        {
          nomeCelula: selectedCelula.nomeCelula || '—',
          reunioes: [...reunioesNoPeriodo].sort((a, b) =>
            String(a.dataReuniao || a.data || '').localeCompare(
              String(b.dataReuniao || b.data || ''),
            ),
          ),
        },
      ];
    }
    const nomeById = new Map(elegiveis.map((c) => [c.id, c.nomeCelula]));
    const by = new Map();
    reunioesNoPeriodo.forEach((r) => {
      const cid = r.celulaId;
      if (!by.has(cid)) by.set(cid, []);
      by.get(cid).push(r);
    });
    return Array.from(by.entries())
      .map(([cid, arr]) => ({
        nomeCelula: nomeById.get(cid) || cid,
        reunioes: arr.sort((a, b) =>
          String(a.dataReuniao || a.data || '').localeCompare(
            String(b.dataReuniao || b.data || ''),
          ),
        ),
      }))
      .sort((a, b) =>
        String(a.nomeCelula).localeCompare(String(b.nomeCelula), 'pt-BR'),
      );
  }, [reunioesNoPeriodo, isTodasCelulas, selectedCelula, elegiveis]);

  const openRelatorioDetalhe = useCallback(() => {
    const { inicio, fim } = periodoOrdenado;
    if (!inicio || !fim) return;
    if (isTodasCelulas) {
      navigation.navigate('Relatorio', {
        todasCelulas: true,
        periodoInicio: inicio,
        periodoFim: fim,
      });
      return;
    }
    if (!selectedCelula) return;
    navigation.navigate('Relatorio', {
      celula: selectedCelula,
      periodoInicio: inicio,
      periodoFim: fim,
    });
  }, [navigation, selectedCelula, isTodasCelulas, periodoOrdenado]);

  const gerarPdfRelatorio = useCallback(async () => {
    if (!reunioesNoPeriodo.length) {
      Alert.alert(
        'Relatório',
        'Não há reuniões neste período para exportar.',
      );
      return;
    }
    const filtroLabel = isTodasCelulas
      ? 'Todas as células (consolidado)'
      : selectedCelula?.nomeCelula ?? '—';
    try {
      const html = buildRelatorioPdfHtml({
        periodoOrdenado,
        filtroLabel,
        grupos: gruposPdf,
        stats: frequenciaStats,
      });
      await shareRelatorioPdf(html);
    } catch (_) {
      /* shareRelatorioPdf já alerta */
    }
  }, [
    reunioesNoPeriodo.length,
    isTodasCelulas,
    selectedCelula?.nomeCelula,
    periodoOrdenado,
    gruposPdf,
    frequenciaStats,
  ]);

  const openDatePicker = useCallback((field) => {
    setActiveDateField(field);
    if (Platform.OS === 'ios') {
      setIosDateModalOpen(true);
    } else {
      setShowAndroidDatePicker(true);
    }
  }, []);

  const closeDatePicker = useCallback(() => {
    setShowAndroidDatePicker(false);
    setIosDateModalOpen(false);
    setActiveDateField(null);
  }, []);

  const applyPickedDate = useCallback(
    (iso) => {
      if (!activeDateField || !iso) return;
      if (activeDateField === 'inicio') setDataInicio(iso);
      else setDataFim(iso);
    },
    [activeDateField]
  );

  const currentPickerIso = useMemo(() => {
    if (activeDateField === 'inicio') return dataInicio;
    if (activeDateField === 'fim') return dataFim;
    return todayIsoDate();
  }, [activeDateField, dataInicio, dataFim]);

  return {
    elegiveis,
    pickerItems,
    selectedCelula,
    selectedCelulaId,
    setSelectedCelulaId,
    selectedCelulaLabel,
    isTodasCelulas,
    celulaPickerOpen,
    setCelulaPickerOpen,
    dataInicio,
    dataFim,
    setDataInicio,
    setDataFim,
    formatIsoDateBr,
    frequenciaStats,
    reunioesNoPeriodo,
    openDrawer,
    openRelatorioDetalhe,
    gerarPdfRelatorio,
    openDatePicker,
    closeDatePicker,
    applyPickedDate,
    showAndroidDatePicker,
    iosDateModalOpen,
    activeDateField,
    currentPickerIso,
    periodoOrdenado,
  };
}
