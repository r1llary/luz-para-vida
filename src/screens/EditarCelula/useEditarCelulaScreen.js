import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { registroCelulaSchema } from '../../schemas/celulaSchema';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { uploadCelulaImageFromUri, getFileViewUrl } from '../../services/appwrite';
import { isAppwriteConfigured } from '../../lib/appwrite';

export function useEditarCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const celula = params?.celula;
  const { updateCelula } = useCelulas();
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
      nomeCelula: celula?.nomeCelula ?? '',
      dia: celula?.dia ?? '',
      horario: celula?.horario ?? '',
      local: celula?.local ?? '',
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
      if (!celula?.id) return;
      setSubmitting(true);
      try {
        let imagemUrl = celula.imagemUrl ?? '';

        if (imageUri && user?.id && isAppwriteConfigured()) {
          try {
            const fileId = await uploadCelulaImageFromUri(imageUri, user.id);
            if (fileId) imagemUrl = String(getFileViewUrl(fileId) ?? '');
          } catch (imgErr) {
            setError('root', {
              message: `Imagem não enviada: ${imgErr?.message ?? 'erro'}. Dados salvos sem alteração de foto.`,
            });
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        const dadosAtualizados = {
          nomeCelula: data.nomeCelula,
          dia: data.dia,
          horario: data.horario,
          local: data.local ?? '',
          imagemUrl,
        };

        await updateCelula(celula.id, dadosAtualizados);

        navigation.navigate('DetalheCelula', {
          celula: { ...celula, ...dadosAtualizados },
        });
      } catch (e) {
        setError('root', {
          message: e?.message || 'Não foi possível salvar as alterações.',
        });
      } finally {
        setSubmitting(false);
      }
    },
    [celula, imageUri, navigation, setError, updateCelula, user?.id]
  );

  return {
    celula,
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
