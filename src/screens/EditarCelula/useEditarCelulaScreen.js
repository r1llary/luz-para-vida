import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';
import {
  uploadCelulaDestaqueFromUri,
  getAvatarViewUrl,
  updateCelulaAppwrite,
} from '../../services/appwrite';
import { formatDateBr } from '../DetalheCelula/useDetalheCelulaScreen';

export function useEditarCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { user } = useAuth();
  const routeCelula = params?.celula;
  const {
    celulas,
    membros: membrosGlobal,
    reunioes: reunioesGlobal,
    updateCelulaFields,
    removeMembro,
    removeReuniao,
    refreshCelulas,
    fetchMembrosForCelula,
  } = useCelulas();

  const celula = useMemo(() => {
    if (!routeCelula?.id) return null;
    return celulas.find((c) => c.id === routeCelula.id) || routeCelula;
  }, [celulas, routeCelula]);

  const membros = useMemo(() => {
    if (!celula?.id) return [];
    return membrosGlobal.filter((m) => m.celulaId === celula.id);
  }, [celula?.id, celula, membrosGlobal]);

  const reunioes = useMemo(() => {
    if (!celula?.id) return [];
    return reunioesGlobal
      .filter((r) => r.celulaId === celula.id)
      .sort((a, b) =>
        String(b.dataReuniao || '').localeCompare(String(a.dataReuniao || ''))
      );
  }, [celula?.id, celula, reunioesGlobal]);

  useEffect(() => {
    if (!celula?.id) return;
    fetchMembrosForCelula(celula.id);
  }, [celula?.id, fetchMembrosForCelula]);

  const opcoesLideranca = useMemo(() => {
    const map = new Map();
    if (user?.id) {
      map.set(user.id, user.nomeCompleto || 'Você');
    }
    membros.forEach((m) => {
      if (m.userId && !map.has(m.userId)) {
        map.set(m.userId, m.nomeCompleto || m.userId);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [user?.id, user?.nomeCompleto, membros]);

  const canEditLideranca = Boolean(
    celula && user?.id && celula.userId === user.id
  );

  const [nomeCelula, setNomeCelula] = useState('');
  const [saving, setSaving] = useState(false);
  /** Seleção local antes de enviar ao Storage (uri + meta). */
  const [imagemDraft, setImagemDraft] = useState(null);
  const [savingFoto, setSavingFoto] = useState(false);
  const [liderModalOpen, setLiderModalOpen] = useState(false);
  const [draftLider, setDraftLider] = useState('');
  const [draftCo, setDraftCo] = useState('');

  useEffect(() => {
    setNomeCelula(celula?.nomeCelula || '');
  }, [celula?.nomeCelula]);

  useEffect(() => {
    setImagemDraft(null);
  }, [celula?.id]);

  useEffect(() => {
    if (!liderModalOpen || !celula) return;
    setDraftLider(celula.liderUserId || user?.id || '');
    setDraftCo(celula.coLiderUserId || '');
  }, [liderModalOpen, celula, user?.id]);

  const opcoesCoLider = useMemo(
    () => opcoesLideranca.filter((o) => o.id !== draftLider),
    [opcoesLideranca, draftLider]
  );

  const onSaveLideranca = useCallback(async () => {
    if (!celula?.id) return;
    if (draftCo && draftCo === draftLider) {
      Alert.alert('Validação', 'Co-líder deve ser outra pessoa além do líder.');
      return;
    }
    if (!draftLider) {
      Alert.alert('Validação', 'Selecione o líder da célula.');
      return;
    }
    try {
      await updateCelulaFields(celula.id, {
        liderUserId: draftLider,
        coLiderUserId: draftCo || '',
      });
      setLiderModalOpen(false);
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Não foi possível salvar.');
    }
  }, [celula?.id, draftLider, draftCo, updateCelulaFields]);

  const previewImagemUri = imagemDraft?.uri || celula?.imagemUrl || null;
  const temRascunhoImagem = Boolean(imagemDraft?.uri);
  const temImagemSalva = Boolean(celula?.imagemUrl);

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
      const a = result.assets[0];
      setImagemDraft({
        uri: a.uri,
        mimeType: a.mimeType || 'image/jpeg',
        fileName: a.fileName || 'image.jpg',
      });
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
      const a = result.assets[0];
      setImagemDraft({
        uri: a.uri,
        mimeType: a.mimeType || 'image/jpeg',
        fileName: a.fileName || 'image.jpg',
      });
    }
  }, []);

  const limparRascunhoImagem = useCallback(() => setImagemDraft(null), []);

  const onSalvarFotoDestaque = useCallback(async () => {
    if (!celula?.id || !user?.id || !imagemDraft?.uri) return;
    setSavingFoto(true);
    try {
      const fileId = await uploadCelulaDestaqueFromUri(
        imagemDraft.uri,
        celula.id,
        user.id,
        imagemDraft.mimeType,
        imagemDraft.fileName,
      );
      if (!fileId) {
        Alert.alert(
          'Erro',
          'Não foi possível enviar a imagem. Verifique o bucket e a conexão.',
        );
        return;
      }
      const previewUrl = getAvatarViewUrl(fileId);
      try {
        await updateCelulaAppwrite(celula.id, { imagemDestaque: fileId });
      } catch (e1) {
        if (previewUrl) {
          try {
            await updateCelulaAppwrite(celula.id, {
              imagemDestaque: previewUrl,
            });
          } catch (e2) {
            Alert.alert(
              'Erro',
              e2?.message || 'Não foi possível salvar a imagem na célula.',
            );
            return;
          }
        } else {
          Alert.alert(
            'Erro',
            e1?.message || 'Não foi possível salvar a imagem na célula.',
          );
          return;
        }
      }
      setImagemDraft(null);
      await refreshCelulas();
      Alert.alert('Sucesso', 'Imagem de destaque atualizada.');
    } finally {
      setSavingFoto(false);
    }
  }, [celula?.id, imagemDraft, refreshCelulas, user?.id]);

  const confirmRemoverImagemDestaque = useCallback(() => {
    if (!celula?.id) return;
    Alert.alert(
      'Remover imagem',
      'Remover a imagem de destaque desta célula?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            setSavingFoto(true);
            try {
              await updateCelulaAppwrite(celula.id, { imagemDestaque: '' });
              setImagemDraft(null);
              await refreshCelulas();
            } catch (e) {
              Alert.alert(
                'Erro',
                e?.message || 'Não foi possível remover a imagem.',
              );
            } finally {
              setSavingFoto(false);
            }
          },
        },
      ],
    );
  }, [celula?.id, refreshCelulas]);

  const onSalvarNome = useCallback(async () => {
    if (!celula?.id) return;
    const t = nomeCelula.trim();
    if (t.length < 2) {
      Alert.alert('Validação', 'Informe um nome com pelo menos 2 caracteres.');
      return;
    }
    setSaving(true);
    try {
      await updateCelulaFields(celula.id, { nomeCelula: t });
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Não foi possível salvar.');
    } finally {
      setSaving(false);
    }
  }, [celula?.id, nomeCelula, navigation, updateCelulaFields]);

  const confirmRemoveMembro = useCallback(
    (membro) => {
      Alert.alert(
        'Remover membro',
        `Remover "${membro.nomeCompleto}" desta célula?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Remover',
            style: 'destructive',
            onPress: async () => {
              try {
                await removeMembro(celula.id, membro);
              } catch (e) {
                Alert.alert('Erro', e?.message || 'Não foi possível remover.');
              }
            },
          },
        ]
      );
    },
    [celula?.id, removeMembro]
  );

  const confirmRemoveReuniao = useCallback(
    (reuniao) => {
      const dataFmt = formatDateBr(reuniao.dataReuniao) || reuniao.dataReuniao;
      Alert.alert(
        'Excluir reunião',
        `Excluir a reunião de ${dataFmt}? Esta ação não pode ser desfeita.`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await removeReuniao(celula.id, reuniao);
              } catch (e) {
                Alert.alert('Erro', e?.message || 'Não foi possível excluir.');
              }
            },
          },
        ]
      );
    },
    [celula?.id, removeReuniao]
  );

  return {
    celula,
    nomeCelula,
    setNomeCelula,
    membros,
    reunioes,
    saving,
    onSalvarNome,
    confirmRemoveMembro,
    confirmRemoveReuniao,
    formatDateBr,
    previewImagemUri,
    temRascunhoImagem,
    temImagemSalva,
    savingFoto,
    pickFromLibrary,
    pickFromCamera,
    limparRascunhoImagem,
    onSalvarFotoDestaque,
    confirmRemoverImagemDestaque,
    canEditLideranca,
    liderModalOpen,
    setLiderModalOpen,
    draftLider,
    setDraftLider,
    draftCo,
    setDraftCo,
    opcoesLideranca,
    opcoesCoLider,
    onSaveLideranca,
  };
}
