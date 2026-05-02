import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registroMembroUsuarioSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { maskCEP, maskDateDMY, onlyDigits, parseDMYToISO } from '../../utils/brFormat';
import {
  fetchEnderecoByCep,
  formatEnderecoFromCep,
} from '../../services/viacep';
import { buildEnderecoString } from '../../utils/buildEndereco';

export function useRegistroMembroScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celulaId = params?.celulaId;
  const { addMembro } = useCelulas();
  const [submitting, setSubmitting] = useState(false);
  const [cepLookupLoading, setCepLookupLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroMembroUsuarioSchema),
    defaultValues: {
      nomeCompleto: '',
      dataNascimento: '',
      cep: '',
      enderecoBase: '',
      numero: '',
      complemento: '',
      email: '',
    },
  });

  const onCepChangeText = useCallback(
    (text, fieldOnChange) => {
      fieldOnChange(maskCEP(text));
      if (onlyDigits(text).length < 8) {
        setValue('enderecoBase', '');
        clearErrors('enderecoBase');
      }
    },
    [clearErrors, setValue]
  );

  const onCepFilled = useCallback(async () => {
    const raw = getValues('cep');
    const cep = onlyDigits(raw);
    if (cep.length !== 8) return;
    clearErrors('cep');
    setCepLookupLoading(true);
    try {
      const found = await fetchEnderecoByCep(cep);
      if (!found) {
        setValue('enderecoBase', '', { shouldValidate: true });
        setError('cep', {
          message: 'CEP não encontrado. Verifique os dígitos.',
        });
        return;
      }
      const linha = formatEnderecoFromCep(found);
      setValue('enderecoBase', linha, { shouldValidate: true });
    } catch {
      setError('cep', { message: 'Não foi possível consultar o CEP.' });
    } finally {
      setCepLookupLoading(false);
    }
  }, [clearErrors, getValues, setError, setValue]);

  const onSubmit = useCallback(
    async (data) => {
      if (!celulaId) return;
      const iso = parseDMYToISO(data.dataNascimento);
      if (!iso) {
        setError('dataNascimento', {
          message: 'Data inválida. Use DD/MM/AAAA.',
        });
        return;
      }

      setSubmitting(true);
      try {
        const cepDigits = onlyDigits(data.cep);
        const endereco = buildEnderecoString({
          enderecoBase: data.enderecoBase,
          numero: data.numero,
          complemento: data.complemento,
          cep: cepDigits,
        });
        const payload = {
          nomeCompleto: data.nomeCompleto.trim(),
          cpfRg: (data.cpfRg || '').trim(),
          email: data.email.trim(),
          telefone: (data.telefone || '').trim(),
          rua: (data.enderecoBase || '').trim(),
          numero: (data.numero || '').trim(),
          complemento: (data.complemento || '').trim(),
          bairro: '',
          cidade: '',
          cep: cepDigits,
          dataNascimento: iso,
          endereco,
        };

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
    [addMembro, celulaId, navigation, setError]
  );

  return {
    celulaId,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    maskDateDMY,
    onCepChangeText,
    onCepFilled,
    cepLookupLoading,
  };
}
