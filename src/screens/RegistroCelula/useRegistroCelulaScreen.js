import { useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { registroCelulaSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';

function buildMembroInicialPayload(item) {
  return {
    nomeCompleto: item.nomeCompleto?.trim() ?? '',
    cpfRg: '',
    email: '',
    telefone: item.telefone?.trim() ?? '',
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    cep: '',
    data: '',
  };
}

export function useRegistroCelulaScreen() {
  const navigation = useNavigation();
  const { addCelula, addMembro } = useCelulas();
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroCelulaSchema),
    defaultValues: {
      nomeCelula: '',
      dia: '',
      horario: '',
      membrosIniciais: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'membrosIniciais',
  });

  const onSubmit = useCallback(
    async (data) => {
      setSubmitting(true);
      try {
        const id = await addCelula({
          nomeCelula: data.nomeCelula,
          dia: data.dia,
          horario: data.horario,
        });
        if (id != null) {
          const membros = data.membrosIniciais ?? [];
          for (const item of membros) {
            const nome = item?.nomeCompleto?.trim();
            if (nome && nome.length >= 3) {
              await addMembro(buildMembroInicialPayload(item), id);
            }
          }
          navigation.replace('DetalheCelula', {
            celula: {
              id,
              nomeCelula: data.nomeCelula,
              dia: data.dia,
              horario: data.horario,
            },
          });
        }
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível cadastrar a célula.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [addCelula, addMembro, navigation, setError],
  );

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    membrosFields: fields,
    appendMembro: () =>
      append({ nomeCompleto: '', telefone: '' }),
    removeMembro: remove,
  };
}
