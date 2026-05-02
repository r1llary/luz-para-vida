import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useEditarCelulaScreen } from './useEditarCelulaScreen';

export default function EditarCelula() {
  const {
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
  } = useEditarCelulaScreen();

  if (!celula) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <Text style={styles.empty}>Célula não encontrada.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>Nome da célula</Text>
        <TextInput
          style={styles.input}
          value={nomeCelula}
          onChangeText={setNomeCelula}
          placeholder="Nome"
          placeholderTextColor="#94a3b8"
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={onSalvarNome}
          disabled={saving}
          activeOpacity={0.9}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>Salvar nome</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Membros</Text>
        <View style={styles.divider} />
        {membros.length === 0 ? (
          <Text style={styles.empty}>Nenhum membro.</Text>
        ) : (
          membros.map((m) => (
            <View key={m.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowText}>{m.nomeCompleto}</Text>
                {m.email ? (
                  <Text style={styles.rowSub}>{m.email}</Text>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => confirmRemoveMembro(m)}
                accessibilityLabel={`Remover ${m.nomeCompleto}`}
              >
                <Text style={styles.removeBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>Reuniões</Text>
        <View style={styles.divider} />
        {reunioes.length === 0 ? (
          <Text style={styles.empty}>Nenhuma reunião.</Text>
        ) : (
          reunioes.map((r) => (
            <View key={r.id} style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowText}>
                  {formatDateBr(r.dataReuniao) || r.dataReuniao}
                </Text>
                <Text style={styles.rowSub} numberOfLines={2}>
                  {r.temaMinistrado || '—'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => confirmRemoveReuniao(r)}
                accessibilityLabel="Excluir reunião"
              >
                <Text style={styles.removeBtnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
