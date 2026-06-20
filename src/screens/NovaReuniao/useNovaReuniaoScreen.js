import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { reuniaoSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { toISODate } from '../../utils/date';

export function useNovaReuniaoScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { addReuniao, fetchMembrosForCelula, getMembrosByCelula } = useCelulas();
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
      dataReuniao: '',
      temaMinistrado: '',
      textoBase: '',
      visitantes: 0,
      membrosPresentesIds: [],
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      if (!celula?.id || !canManage) return;
      setSubmitting(true);
      try {
        await addReuniao(celula.id, {
          ...data,
          dataReuniao: toISODate(data.dataReuniao),
        });
        navigation.goBack();
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível registrar a reunião.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [addReuniao, canManage, celula?.id, navigation, setError],
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
