import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { registroCelulaSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { uploadCelulaImageFromUri, getFileViewUrl } from '../../services/appwrite';
import { isAppwriteConfigured } from '../../lib/appwrite';

export function useRegistroCelulaScreen() {
  const navigation = useNavigation();
  const { addCelula } = useCelulas();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [imageUri, setImageUri] = useState(null);

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
      local: '',
    },
  });

  const pickImagem = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  }, []);

  const removeImagem = useCallback(() => setImageUri(null), []);

  const onSubmit = useCallback(
    async (data) => {
      setSubmitting(true);
      try {
        let imagemUrl = '';
        if (imageUri && user?.id && isAppwriteConfigured()) {
          try {
            const fileId = await uploadCelulaImageFromUri(imageUri, user.id);
            if (fileId) imagemUrl = String(getFileViewUrl(fileId) ?? '');
          } catch (imgErr) {
            setError('root', {
              message: `A imagem não pôde ser enviada: ${imgErr?.message ?? 'erro desconhecido'}. A célula será cadastrada sem foto.`,
            });
            // Aguarda 2s para o usuário ler o aviso e segue sem imagem
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        const id = await addCelula({
          nomeCelula: data.nomeCelula,
          dia: data.dia,
          horario: data.horario,
          local: data.local ?? '',
          imagemUrl,
        });

        if (id != null) {
          navigation.replace('DetalheCelula', {
            celula: {
              id,
              nomeCelula: data.nomeCelula,
              dia: data.dia,
              horario: data.horario,
              local: data.local ?? '',
              imagemUrl,
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
    [addCelula, imageUri, navigation, setError, user?.id],
  );

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    imageUri,
    pickImagem,
    removeImagem,
  };
}
