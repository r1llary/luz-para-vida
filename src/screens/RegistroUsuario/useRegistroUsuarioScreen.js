import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { registroUsuarioSchema } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';

export function useRegistroUsuarioScreen() {
  const navigation = useNavigation();
  const { signUp, loading } = useAuth();
  const [fotoUri, setFotoUri] = useState(null);

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
    },
  });

  const pickFoto = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
    }
  }, []);

  const clearFoto = useCallback(() => setFotoUri(null), []);

  const onSubmit = async (data) => {
    const result = await signUp({
      nomeCompleto: data.nomeCompleto,
      email: data.email,
      senha: data.senha,
      dataNascimento: data.dataNascimento,
      endereco: data.endereco,
      fotoUri: fotoUri || undefined,
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
    fotoUri,
    pickFoto,
    clearFoto,
  };
}
