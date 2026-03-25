import { useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { relatorioSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';

export function useRelatorioScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { updateRelatorio, loadRelatorioForCelula } = useCelulas();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(relatorioSchema),
    defaultValues: {
      temaMinistrado: celula?.temaMinistrado || '',
      textoBase: celula?.relatorio?.textoBase || '',
      visitantes: celula?.relatorio?.visitantes ?? 0,
      membrosPresentes: celula?.relatorio?.membrosPresentes ?? 0,
    },
  });

  useEffect(() => {
    if (!celula?.id) return;
    loadRelatorioForCelula(celula.id).then((rel) => {
      if (rel) {
        reset({
          temaMinistrado: rel.temaMinistrado ?? celula?.temaMinistrado ?? '',
          textoBase: rel.textoBase ?? '',
          visitantes: rel.visitantes ?? 0,
          membrosPresentes: rel.membrosPresentes ?? 0,
        });
      }
    });
  }, [celula?.id, loadRelatorioForCelula, reset]);

  const onSubmit = useCallback(
    (data) => {
      if (celula?.id) {
        updateRelatorio(celula.id, data);
      }
      navigation.goBack();
    },
    [celula?.id, navigation, updateRelatorio],
  );

  return {
    celula,
    control,
    handleSubmit,
    errors,
    onSubmit,
  };
}
