import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { registroUsuarioSchema } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';

export function useRegistroUsuarioScreen() {
  const navigation = useNavigation();
  const { signUp, loading } = useAuth();
  const [permissao, setPermissao] = useState('membro');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroUsuarioSchema),
    defaultValues: {
      nomeCompleto: '',
      dataNascimento: '',
      endereco: '',
      email: '',
      senha: '',
      confirmarSenha: '',
      permissao: 'membro',
    },
  });

  const onSubmit = async (data) => {
    const result = await signUp({
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      senha: data.senha,
      dataNascimento: data.dataNascimento,
      endereco: data.endereco,
      permissao,
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
    permissao,
    setPermissao,
  };
}
