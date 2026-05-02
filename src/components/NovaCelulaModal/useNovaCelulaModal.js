import { useState, useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { registroCelulaSchema } from '../../schemas';
import { useCelulas } from '../../contexts/CelulasContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatHorarioBr, parseHorarioToDate } from '../../utils/horarioBr';

export function useNovaCelulaModal({ visible, onClose, onCreated }) {
  const { user } = useAuth();
  const { addCelula, celulas } = useCelulas();
  const [submitting, setSubmitting] = useState(false);
  const [imagemUri, setImagemUri] = useState(null);
  const [diaModalOpen, setDiaModalOpen] = useState(false);
  const [celulaRaizModalOpen, setCelulaRaizModalOpen] = useState(false);
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [iosTimeDraft, setIosTimeDraft] = useState(() => new Date());

  /** Células em que o usuário logado é líder (referência opcional para nova célula). */
  const opcoesCelulaRaiz = useMemo(() => {
    const uid = user?.id;
    if (!uid || !Array.isArray(celulas)) return [];
    return celulas.filter(
      (c) => c?.liderUserId && String(c.liderUserId) === String(uid),
    );
  }, [celulas, user?.id]);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registroCelulaSchema),
    defaultValues: {
      nomeCelula: '',
      local: '',
      endereco: '',
      dia: '',
      horario: '',
      celulaRaiz: '',
    },
  });

  useEffect(() => {
    if (!visible) {
      reset({
        nomeCelula: '',
        local: '',
        endereco: '',
        dia: '',
        horario: '',
        celulaRaiz: '',
      });
      setImagemUri(null);
      setDiaModalOpen(false);
      setCelulaRaizModalOpen(false);
      setTimePickerOpen(false);
    }
  }, [visible, reset]);

  const pickFromLibrary = useCallback(async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImagemUri(result.assets[0].uri);
    }
  }, []);

  const pickFromCamera = useCallback(async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      setImagemUri(result.assets[0].uri);
    }
  }, []);

  const clearImagem = useCallback(() => setImagemUri(null), []);

  const selectDia = useCallback(
    (label) => {
      setValue('dia', label, { shouldValidate: true });
      setDiaModalOpen(false);
    },
    [setValue],
  );

  const selectCelulaRaizId = useCallback(
    (celulaId) => {
      setValue('celulaRaiz', celulaId || '', { shouldValidate: true });
      setCelulaRaizModalOpen(false);
    },
    [setValue],
  );

  const openTimePicker = useCallback(() => {
    setIosTimeDraft(parseHorarioToDate(getValues('horario')));
    setTimePickerOpen(true);
  }, [getValues]);

  const onAndroidTimeChange = useCallback(
    (_event, date) => {
      if (Platform.OS === 'android') {
        setTimePickerOpen(false);
        if (date) {
          setValue('horario', formatHorarioBr(date), { shouldValidate: true });
        }
      }
    },
    [setValue],
  );

  const onIosTimeChange = useCallback((_, date) => {
    if (date) setIosTimeDraft(date);
  }, []);

  const confirmIosTime = useCallback(() => {
    setValue('horario', formatHorarioBr(iosTimeDraft), { shouldValidate: true });
    setTimePickerOpen(false);
  }, [iosTimeDraft, setValue]);

  const cancelTimePicker = useCallback(() => {
    setTimePickerOpen(false);
  }, []);

  const onSubmit = useCallback(
    async (data) => {
      setSubmitting(true);
      try {
        const result = await addCelula({
          nomeCelula: data.nomeCelula,
          local: data.local,
          endereco: data.endereco,
          dia: data.dia,
          horario: data.horario,
          celulaRaiz: (data.celulaRaiz || '').trim(),
          imagemUri,
        });
        if (result?.id) {
          onCreated({
            id: result.id,
            nomeCelula: data.nomeCelula,
            local: data.local,
            endereco: data.endereco,
            dia: data.dia,
            horario: data.horario,
            celulaRaiz: (data.celulaRaiz || '').trim(),
            imagemUrl: result.imagemUrl ?? null,
          });
          onClose();
        } else {
          setError('root', {
            message: 'Não foi possível cadastrar a célula.',
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
    [addCelula, imagemUri, onClose, onCreated, setError],
  );

  return {
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    imagemUri,
    pickFromLibrary,
    pickFromCamera,
    clearImagem,
    opcoesCelulaRaiz,
    diaModalOpen,
    setDiaModalOpen,
    selectDia,
    celulaRaizModalOpen,
    setCelulaRaizModalOpen,
    selectCelulaRaizId,
    timePickerOpen,
    iosTimeDraft,
    openTimePicker,
    onAndroidTimeChange,
    onIosTimeChange,
    confirmIosTime,
    cancelTimePicker,
  };
}
