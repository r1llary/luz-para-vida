import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';
import { formatDateBr } from '../DetalheCelula/useDetalheCelulaScreen';

export function useEditarCelulaScreen() {
  const navigation = useNavigation();
  const { params } = useRoute();
  const routeCelula = params?.celula;
  const {
    celulas,
    membros: membrosGlobal,
    reunioes: reunioesGlobal,
    updateCelulaFields,
    removeMembro,
    removeReuniao,
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

  const [nomeCelula, setNomeCelula] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setNomeCelula(celula?.nomeCelula || '');
  }, [celula?.nomeCelula]);

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
  };
}
