import React from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from '../NovaReuniao/styles';
import { useEditarReuniaoScreen } from './useEditarReuniaoScreen';

export default function EditarReuniao() {
  const {
    celula,
    membros,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    visitanteFields,
    appendVisitante,
    removeVisitante,
  } = useEditarReuniaoScreen();

  if (!celula) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar style="light" />
        <View style={[styles.inner, { padding: 24, justifyContent: 'center', flex: 1 }]}>
          <Text style={{ color: '#94A3B8', textAlign: 'center', fontSize: 15 }}>
            Célula não encontrada.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Editar reunião — {celula.nomeCelula}</Text>

              <Controller
                control={control}
                name="dataReuniao"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Data (DD/MM/AAAA)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.dataReuniao?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="temaMinistrado"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Tema ministrado"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.temaMinistrado?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="textoBase"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Texto base (opcional)"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
            </View>

            <View style={styles.card}>
              <Text style={styles.visitantesLabel}>Visitantes</Text>
              <Text style={styles.visitantesHint}>
                Registre os visitantes que compareceram a esta reunião.
              </Text>

              {visitanteFields.map((field, index) => (
                <View key={field.id} style={styles.visitanteCard}>
                  <View style={styles.visitanteInputs}>
                    <Controller
                      control={control}
                      name={`visitantesDetalhes.${index}.nome`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          variant="auth"
                          placeholder="Nome do visitante"
                          value={value}
                          onChangeText={onChange}
                          onBlur={onBlur}
                          error={errors.visitantesDetalhes?.[index]?.nome?.message}
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name={`visitantesDetalhes.${index}.contato`}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <Input
                          variant="auth"
                          placeholder="Telefone ou e-mail (opcional)"
                          value={value ?? ''}
                          onChangeText={onChange}
                          onBlur={onBlur}
                        />
                      )}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.visitanteRemoveBtn}
                    onPress={() => removeVisitante(index)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.visitanteRemoveBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {visitanteFields.length === 0 && (
                <Text style={styles.visitanteVazio}>Nenhum visitante adicionado.</Text>
              )}

              <TouchableOpacity
                style={styles.visitanteAddBtn}
                onPress={() => appendVisitante({ nome: '', contato: '' })}
                activeOpacity={0.8}
              >
                <Text style={styles.visitanteAddBtnText}>+ Adicionar visitante</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.card}>
              <Text style={styles.presencaLabel}>Membros presentes</Text>
              <Text style={styles.presencaHint}>
                Toque para marcar ou desmarcar a presença de cada membro.
              </Text>
              <Controller
                control={control}
                name="membrosPresentesIds"
                render={({ field: { value, onChange } }) => {
                  const selected = Array.isArray(value) ? value : [];
                  const toggle = (membroId) => {
                    if (selected.includes(membroId)) {
                      onChange(selected.filter((id) => id !== membroId));
                    } else {
                      onChange([...selected, membroId]);
                    }
                  };

                  if (membros.length === 0) {
                    return (
                      <Text style={styles.semMembros}>
                        Nenhum membro cadastrado nesta célula. Cadastre membros
                        no detalhe da célula para registrar presença por nome.
                      </Text>
                    );
                  }

                  return (
                    <View style={styles.membrosBox}>
                      {membros.map((m, idx) => {
                        const ativo = selected.includes(m.id);
                        return (
                          <TouchableOpacity
                            key={m.id}
                            style={[
                              styles.membroLinha,
                              ativo && styles.membroLinhaAtiva,
                              idx === membros.length - 1 && { borderBottomWidth: 0 },
                            ]}
                            onPress={() => toggle(m.id)}
                            activeOpacity={0.85}
                            accessibilityRole="checkbox"
                            accessibilityState={{ checked: ativo }}
                          >
                            <Text style={styles.membroCheck}>{ativo ? '☑' : '☐'}</Text>
                            <Text style={styles.membroNome} numberOfLines={2}>
                              {m.nomeCompleto}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  );
                }}
              />
              {errors.membrosPresentesIds?.message ? (
                <Text style={styles.errorField}>{errors.membrosPresentesIds.message}</Text>
              ) : null}

              {errors.root?.message ? (
                <Text style={styles.errorRoot}>{errors.root.message}</Text>
              ) : null}

              <View style={styles.btnWrap}>
                <Button
                  variant="accent"
                  title="SALVAR ALTERAÇÕES"
                  onPress={handleSubmit(onSubmit)}
                  loading={submitting}
                />
              </View>
            </View>
          </View>

          <Text style={styles.footer}>Luz para Vida · Camila Guimaraes</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
