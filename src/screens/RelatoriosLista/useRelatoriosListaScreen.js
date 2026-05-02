import { useCallback, useEffect, useMemo, useState } from 'react';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Platform } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import { CELULA_RELATORIO_TODAS_ID } from '../../constants/relatorio';
import { filterCelulasParaRelatorio } from '../../utils/celulaRelatorio';
import { formatIsoDateBr, localDateToIso, todayIsoDate } from '../../utils/brFormat';

function monthBoundsIso() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return {
    inicio: localDateToIso(start),
    fim: localDateToIso(end),
  };
}

function countPresencasReuniao(r) {
  const ids = r.membrosPresentesIds;
  if (Array.isArray(ids) && ids.length > 0) return ids.length;
  return Number(r.membrosPresentes) || 0;
}

function visitantesStatsFromReunioes(reunioes) {
  const nomeToReuniaoIds = new Map();
  let registros = 0;

  reunioes.forEach((r) => {
    const lista = Array.isArray(r.visitantesLista) ? r.visitantesLista : [];
    if (lista.length > 0) {
      registros += lista.length;
      lista.forEach((v) => {
        const key = String(v?.nome ?? '')
          .trim()
          .toLowerCase();
        if (!key) return;
        if (!nomeToReuniaoIds.has(key)) nomeToReuniaoIds.set(key, new Set());
        nomeToReuniaoIds.get(key).add(r.id);
      });
    } else {
      registros += Number(r.visitantes) || 0;
    }
  });

  let visitantesRecorrentes = 0;
  nomeToReuniaoIds.forEach((ids) => {
    if (ids.size > 1) visitantesRecorrentes += 1;
  });

  const comNome = nomeToReuniaoIds.size > 0;
  const numeroVisitantes = comNome ? nomeToReuniaoIds.size : registros;

  return { numeroVisitantes, visitantesRecorrentes, registrosVisitantes: registros };
}

function membrosCountForCelula(celulaId, membrosGlobal) {
  return membrosGlobal.filter((m) => m.celulaId === celulaId).length;
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

  const frequenciaStats = useMemo(() => {
    let totalMembros;
    if (isTodasCelulas) {
      totalMembros = elegiveis.reduce(
        (s, c) => s + membrosCountForCelula(c.id, membrosGlobal),
        0
      );
    } else {
      totalMembros = membrosLista.length;
    }
    const somaPresencas = reunioesNoPeriodo.reduce(
      (s, r) => s + countPresencasReuniao(r),
      0
    );
    const reunioesCount = reunioesNoPeriodo.length;
    const totalSlots = totalMembros * reunioesCount;
    const taxaFrequenciaPct =
      totalSlots > 0
        ? Math.round((1000 * somaPresencas) / totalSlots) / 10
        : null;

    const { numeroVisitantes, visitantesRecorrentes } =
      visitantesStatsFromReunioes(reunioesNoPeriodo);

    return {
      totalMembros,
      somaPresencas,
      reunioesCount,
      totalSlots,
      taxaFrequenciaPct,
      numeroVisitantes,
      visitantesRecorrentes,
    };
  }, [
    isTodasCelulas,
    elegiveis,
    membrosGlobal,
    membrosLista.length,
    reunioesNoPeriodo,
  ]);

  const openDrawer = useCallback(() => {
    navigation.dispatch(DrawerActions.openDrawer());
  }, [navigation]);

  const openRelatorioDetalhe = useCallback(() => {
    if (!selectedCelula || isTodasCelulas) return;
    navigation.navigate('Relatorio', {
      celula: selectedCelula,
      periodoInicio: periodoOrdenado.inicio,
      periodoFim: periodoOrdenado.fim,
    });
  }, [navigation, selectedCelula, isTodasCelulas, periodoOrdenado]);

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
