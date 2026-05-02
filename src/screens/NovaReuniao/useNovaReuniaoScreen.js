import { useState, useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { reuniaoSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { todayIsoDate } from '../../utils/brFormat';

export function useNovaReuniaoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const {
    membros: membrosGlobal,
    addReuniao,
    fetchMembrosForCelula,
  } = useCelulas();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (celula?.id) fetchMembrosForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula]);

  const membros = useMemo(() => {
    if (!celula?.id) return [];
    return membrosGlobal.filter((m) => m.celulaId === celula.id);
  }, [celula?.id, membrosGlobal]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reuniaoSchema),
    defaultValues: {
      dataReuniao: todayIsoDate(),
      temaMinistrado: '',
      textoBase: '',
      visitantesLista: [],
      membrosPresentesIds: [],
    },
  });

  const addVisitante = useCallback(
    (item) => {
      const cur = getValues('visitantesLista') || [];
      setValue('visitantesLista', [...cur, item], { shouldValidate: true });
    },
    [getValues, setValue]
  );

  const removeVisitante = useCallback(
    (index) => {
      const cur = getValues('visitantesLista') || [];
      setValue(
        'visitantesLista',
        cur.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    },
    [getValues, setValue]
  );

  const toggleMembroPresente = useCallback(
    (membroId) => {
      const cur = getValues('membrosPresentesIds') || [];
      const next = cur.includes(membroId)
        ? cur.filter((id) => id !== membroId)
        : [...cur, membroId];
      setValue('membrosPresentesIds', next, { shouldValidate: true });
    },
    [getValues, setValue]
  );

  const onSubmit = useCallback(
    async (data) => {
      if (!celula?.id) return;
      setSubmitting(true);
      try {
        await addReuniao(celula.id, data);
        navigation.goBack();
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível registrar a reunião.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [addReuniao, celula?.id, navigation, setError]
  );

  return {
    celula,
    membros,
    control,
    handleSubmit,
    setValue,
    getValues,
    errors,
    onSubmit,
    submitting,
    addVisitante,
    removeVisitante,
    toggleMembroPresente,
  };
}
