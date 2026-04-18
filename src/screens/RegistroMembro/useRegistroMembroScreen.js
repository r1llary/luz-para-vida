import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registroMembroSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';

export function useRegistroMembroScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celulaId = params?.celulaId;
  const { addMembro } = useCelulas();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroMembroSchema),
    defaultValues: {
      nomeCompleto: '',
      email: '',
      telefone: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      cep: '',
      data: '',
    },
  });

  const onSubmit = useCallback(
    async (data) => {
      if (!celulaId) return;
      setSubmitting(true);
      try {
        const payload = { ...data, cpfRg: '' };
        await addMembro(payload, celulaId);
        navigation.goBack();
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível cadastrar o membro.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [addMembro, celulaId, navigation, setError],
  );

  return {
    celulaId,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
  };
}
