import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import { loginSchema } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';

export function useLoginScreen() {
  const navigation = useNavigation();
  const { signIn, loading } = useAuth();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', senha: '' },
  });

  const onSubmit = async (data) => {
    const result = await signIn(data.email, data.senha);
    if (!result.success) {
      setError('root', { message: result.error || 'Erro ao entrar' });
    }
  };

  const goToRegistroUsuario = () => navigation.navigate('RegistroUsuario');

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    goToRegistroUsuario,
  };
}
