import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { registroMembroSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { getUserByEmailAppwrite } from '../../services/appwrite';
import { isAppwriteDatabaseConfigured } from '../../lib/appwrite';

export function useRegistroMembroScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celulaId = params?.celulaId;
  const { addMembro } = useCelulas();

  const [submitting, setSubmitting] = useState(false);
  const [buscarEmail, setBuscarEmail] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadoBusca, setResultadoBusca] = useState(null);
  const [buscandoCep, setBuscandoCep] = useState(false);
  // null | { encontrado: true, nome: string } | { encontrado: false, erro?: string }

  const {
    control,
    handleSubmit,
    setError,
    setValue,
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

  const buscarMembro = useCallback(async () => {
    const email = buscarEmail.trim().toLowerCase();
    if (!email) return;

    setBuscando(true);
    setResultadoBusca(null);

    try {
      if (!isAppwriteDatabaseConfigured()) {
        setResultadoBusca({ encontrado: false });
        setValue('email', email);
        return;
      }

      const usuario = await getUserByEmailAppwrite(email);

      if (usuario) {
        setValue('nomeCompleto', usuario.nomeCompleto || '');
        setValue('email', usuario.email || email);
        setValue('data', usuario.dataNascimento || '');
        // endereco é string única no perfil — preenche o campo rua para o líder completar
        if (usuario.endereco) setValue('rua', usuario.endereco);
        setResultadoBusca({ encontrado: true, nome: usuario.nomeCompleto });
      } else {
        setValue('email', email);
        setResultadoBusca({ encontrado: false });
      }
    } catch (e) {
      setValue('email', email);
      setResultadoBusca({ encontrado: false, erro: e?.message });
    } finally {
      setBuscando(false);
    }
  }, [buscarEmail, setValue]);

  const buscarCep = useCallback(async (cep) => {
    const digits = (cep || '').replace(/\D/g, '');
    if (digits.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) return;
      setValue('rua', data.logradouro || '');
      setValue('bairro', data.bairro || '');
      setValue('cidade', data.localidade || '');
    } catch (_) {
      /* falha silenciosa — usuário preenche manualmente */
    } finally {
      setBuscandoCep(false);
    }
  }, [setValue]);

  const onSubmit = useCallback(
    async (data) => {
      if (!celulaId) return;
      setSubmitting(true);
      try {
        await addMembro({ ...data, cpfRg: '' }, celulaId);
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
    buscarEmail,
    setBuscarEmail,
    buscando,
    buscarMembro,
    resultadoBusca,
    buscarCep,
    buscandoCep,
  };
}
