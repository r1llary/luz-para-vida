import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { reuniaoSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { toISODate, formatDateBr } from '../../utils/date';

export function useEditarReuniaoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const reuniao = params?.reuniao;
  const celula = params?.celula;
  const { updateReuniao, fetchMembrosForCelula, getMembrosByCelula } = useCelulas();
  const { canManage } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (celula?.id) fetchMembrosForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula]);

  const membros = celula?.id ? getMembrosByCelula(celula.id) : [];

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reuniaoSchema),
    defaultValues: {
      dataReuniao: formatDateBr(reuniao?.dataReuniao ?? ''),
      temaMinistrado: reuniao?.temaMinistrado ?? '',
      textoBase: reuniao?.textoBase ?? '',
      visitantes: reuniao?.visitantes ?? 0,
      membrosPresentesIds: Array.isArray(reuniao?.membrosPresentesIds)
        ? reuniao.membrosPresentesIds
        : [],
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      if (!reuniao?.id || !celula?.id || !canManage) return;
      setSubmitting(true);
      try {
        const isoDate = toISODate(data.dataReuniao);
        const ids = Array.isArray(data.membrosPresentesIds) ? data.membrosPresentesIds : [];
        await updateReuniao(reuniao.id, celula.id, { ...data, dataReuniao: isoDate });
        navigation.navigate('DetalheReuniao', {
          reuniao: {
            ...reuniao,
            dataReuniao: isoDate,
            temaMinistrado: data.temaMinistrado,
            textoBase: data.textoBase ?? '',
            visitantes: Number(data.visitantes) || 0,
            membrosPresentes: ids.length,
            membrosPresentesIds: ids,
          },
          celulaNome: celula?.nomeCelula,
        });
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível atualizar a reunião.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [updateReuniao, canManage, reuniao, celula, navigation, setError]
  );

  return {
    celula,
    membros,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
  };
}
