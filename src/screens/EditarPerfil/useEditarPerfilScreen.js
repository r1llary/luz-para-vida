import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { edicaoPerfilSchema } from '../../schemas';
import { useAuth } from '../../contexts/AuthContext';
import { toDisplayDate } from '../../utils/date';

export function useEditarPerfilScreen() {
  const navigation = useNavigation();
  const { user, loading, updateProfile } = useAuth();
  const [fotoUri, setFotoUri] = useState(null);
  const [removeFoto, setRemoveFoto] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(edicaoPerfilSchema),
    defaultValues: {
      nomeCompleto: '',
      dataNascimento: '',
      endereco: '',
      email: '',
      novaSenha: '',
      confirmarNovaSenha: '',
      senhaAtual: '',
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      nomeCompleto: user.nomeCompleto || '',
      dataNascimento: toDisplayDate(user.dataNascimento),
      endereco: user.endereco || '',
      email: user.email || '',
      novaSenha: '',
      confirmarNovaSenha: '',
      senhaAtual: '',
    });
    setFotoUri(null);
    setRemoveFoto(false);
  }, [user, reset]);

  const pickFoto = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
      setRemoveFoto(false);
    }
  }, []);

  const clearFotoEscolha = useCallback(() => {
    if (fotoUri) {
      setFotoUri(null);
      return;
    }
    setRemoveFoto(true);
  }, [fotoUri]);

  const onSubmit = async (data) => {
    const emailOrig = (user?.email || '').trim().toLowerCase();
    const emailNovo = data.email.trim().toLowerCase();
    const emailChanged = emailNovo !== emailOrig;
    const querSenhaNova = !!(data.novaSenha && data.novaSenha.trim().length > 0);

    if ((emailChanged || querSenhaNova) && !data.senhaAtual?.trim()) {
      setError('senhaAtual', {
        message:
          'Informe sua senha atual para alterar email ou definir nova senha.',
      });
      return;
    }

    const result = await updateProfile({
      nomeCompleto: data.nomeCompleto,
      dataNascimento: data.dataNascimento,
      endereco: data.endereco,
      email: data.email.trim(),
      fotoUri: fotoUri || undefined,
      removeFoto: removeFoto && !fotoUri,
      novaSenha: querSenhaNova ? data.novaSenha : undefined,
      senhaAtual: data.senhaAtual?.trim() || undefined,
    });

    if (!result.success) {
      setError('root', {
        message: result.error || 'Erro ao salvar perfil.',
      });
      return;
    }

    Alert.alert('Perfil', 'Alterações salvas com sucesso.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    user,
    fotoUri,
    removeFoto,
    pickFoto,
    clearFotoEscolha,
  };
}
