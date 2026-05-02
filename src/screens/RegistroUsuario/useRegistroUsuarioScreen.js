import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigation } from '@react-navigation/native';

import { registroUsuarioSchema } from '../../schemas';

import { useAuth } from '../../contexts/AuthContext';

import { maskCEP, maskDateDMY, onlyDigits, parseDMYToISO } from '../../utils/brFormat';

import { buildEnderecoString } from '../../utils/buildEndereco';

import {

  fetchEnderecoByCep,

  formatEnderecoFromCep,

} from '../../services/viacep';



export function useRegistroUsuarioScreen() {

  const navigation = useNavigation();

  const { signUp, loading } = useAuth();

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

    resolver: zodResolver(registroUsuarioSchema),

    defaultValues: {

      nomeCompleto: '',

      dataNascimento: '',

      cep: '',

      enderecoBase: '',

      numero: '',

      complemento: '',

      email: '',

      senha: '',

      confirmarSenha: '',

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

    [clearErrors, setValue],

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



  const onSubmit = async (data) => {

    const iso = parseDMYToISO(data.dataNascimento);

    if (!iso) {

      setError('dataNascimento', {

        message: 'Data inválida. Use DD/MM/AAAA.',

      });

      return;

    }

    const endereco = buildEnderecoString({

      enderecoBase: data.enderecoBase,

      numero: data.numero,

      complemento: data.complemento,

      cep: onlyDigits(data.cep),

    });

    const result = await signUp({

      nomeCompleto: data.nomeCompleto,

      email: data.email,

      senha: data.senha,

      dataNascimento: iso,

      endereco,

    });

    if (!result.success) {

      setError('root', { message: result.error || 'Erro ao cadastrar' });

    }

  };



  const goToLogin = () => navigation.navigate('Login');



  return {

    control,

    handleSubmit,

    errors,

    onSubmit,

    loading,

    goToLogin,

    maskDateDMY,

    maskCEP,

    onCepChangeText,

    onCepFilled,

    cepLookupLoading,

  };

}

