import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller, useWatch } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import {
  formatIsoDateBr,
  isoDateToLocalDate,
  localDateToIso,
} from '../../utils/brFormat';
import { styles } from './styles';
import { useNovaReuniaoScreen } from './useNovaReuniaoScreen';

export default function NovaReuniao() {
  const {
    celula,
    membros,
    control,
    handleSubmit,
    setValue,
    errors,
    onSubmit,
    submitting,
    addVisitante,
    removeVisitante,
    toggleMembroPresente,
  } = useNovaReuniaoScreen();

  const insets = useSafeAreaInsets();
  const [visitorSheetOpen, setVisitorSheetOpen] = useState(false);
  const [draftNome, setDraftNome] = useState('');
  const [draftTelefone, setDraftTelefone] = useState('');
  const [draftObservacoes, setDraftObservacoes] = useState('');
  const [draftVisitorError, setDraftVisitorError] = useState('');
  const [showAndroidDatePicker, setShowAndroidDatePicker] = useState(false);
  const [iosDateModalOpen, setIosDateModalOpen] = useState(false);

  const visitantesLista = useWatch({ control, name: 'visitantesLista' }) || [];
  const membrosPresentesIds =
    useWatch({ control, name: 'membrosPresentesIds' }) || [];
  const dataReuniaoWatch = useWatch({ control, name: 'dataReuniao' });

  const openVisitorSheet = useCallback(() => {
    setDraftNome('');
    setDraftTelefone('');
    setDraftObservacoes('');
    setDraftVisitorError('');
    setVisitorSheetOpen(true);
  }, []);

  const confirmVisitor = useCallback(() => {
    const nome = draftNome.trim();
    if (!nome) {
      setDraftVisitorError('Informe o nome do visitante.');
      return;
    }
    addVisitante({
      nome,
      telefone: draftTelefone.trim() || undefined,
      observacoes: draftObservacoes.trim() || undefined,
    });
    setVisitorSheetOpen(false);
  }, [draftNome, draftTelefone, draftObservacoes, addVisitante]);

  if (!celula) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar style="light" />
        <View style={styles.inner}>
          <Text style={styles.subtitle}>Célula não encontrada.</Text>
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
            <Text style={styles.fieldLabel}>Data</Text>
            <Controller
              control={control}
              name="dataReuniao"
              render={({ field: { value, onChange } }) => (
                <>
                  <TouchableOpacity
                    style={styles.dateTouchable}
                    onPress={() =>
                      Platform.OS === 'ios'
                        ? setIosDateModalOpen(true)
                        : setShowAndroidDatePicker(true)
                    }
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel="Abrir calendário para escolher a data"
                  >
                    <Text style={styles.dateTouchableText}>
                      {value
                        ? formatIsoDateBr(value)
                        : 'Toque para escolher a data'}
                    </Text>
                    <Text style={styles.dateTouchableHint}>DD/MM/AAAA</Text>
                  </TouchableOpacity>
                  {errors.dataReuniao?.message ? (
                    <Text style={styles.errorField}>
                      {errors.dataReuniao.message}
                    </Text>
                  ) : null}

                  {showAndroidDatePicker ? (
                    <DateTimePicker
                      value={isoDateToLocalDate(value || dataReuniaoWatch)}
                      mode="date"
                      display="default"
                      onChange={(event, date) => {
                        setShowAndroidDatePicker(false);
                        if (event.type === 'dismissed') return;
                        if (date) onChange(localDateToIso(date));
                      }}
                    />
                  ) : null}
                </>
              )}
            />

            <Text style={styles.fieldLabel}>Tema ministrado</Text>
            <Controller
              control={control}
              name="temaMinistrado"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Tema ministrado na reunião"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.temaMinistrado?.message}
                />
              )}
            />

            <Text style={styles.fieldLabel}>Observações (opcional)</Text>
            <Controller
              control={control}
              name="textoBase"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Anotações da reunião"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  multiline
                />
              )}
            />

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitleLeft}>Visitantes</Text>
              <TouchableOpacity
                onPress={openVisitorSheet}
                accessibilityRole="button"
                accessibilityLabel="Adicionar visitante"
              >
                <Text style={styles.sectionLink}>Adicionar visitante</Text>
              </TouchableOpacity>
            </View>
            {errors.visitantesLista?.message ? (
              <Text style={styles.errorField}>
                {errors.visitantesLista.message}
              </Text>
            ) : null}

            {visitantesLista.length === 0 ? (
              <Text style={styles.emptyInline}>
                Nenhum visitante adicionado.
              </Text>
            ) : (
              <View style={styles.listCard}>
                {visitantesLista.map((v, index) => (
                  <View key={`v-${index}`} style={styles.listRow}>
                    <View style={styles.listRowText}>
                      <Text style={styles.listRowNome}>{v.nome}</Text>
                      {v.telefone ? (
                        <Text style={styles.listRowSub}>{v.telefone}</Text>
                      ) : null}
                      {v.observacoes?.trim() ? (
                        <Text style={styles.listRowObs}>{v.observacoes.trim()}</Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() => removeVisitante(index)}
                      accessibilityRole="button"
                      accessibilityLabel="Remover visitante"
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.removeLink}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={[styles.sectionHeaderRow, styles.sectionHeaderRowSpaced]}>
              <Text style={styles.sectionTitleLeft}>Membros presentes</Text>
            </View>
            <Text style={styles.presencaHint}>
              Marque os membros cadastrados nesta célula que estiveram presentes.
            </Text>

            {membros.length === 0 ? (
              <Text style={styles.semMembros}>
                Nenhum membro cadastrado nesta célula. Cadastre membros no detalhe
                da célula.
              </Text>
            ) : (
              <View style={styles.multiselectCard}>
                {membros.map((m) => {
                  const on = membrosPresentesIds.includes(m.id);
                  return (
                    <TouchableOpacity
                      key={m.id}
                      style={[styles.membroSelectRow, on && styles.membroSelectRowOn]}
                      onPress={() => toggleMembroPresente(m.id)}
                      activeOpacity={0.85}
                      accessibilityRole="checkbox"
                      accessibilityState={{ checked: on }}
                    >
                      <Text style={styles.membroSelectCheck}>{on ? '☑' : '☐'}</Text>
                      <Text style={styles.membroSelectNome} numberOfLines={2}>
                        {m.nomeCompleto}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {errors.membrosPresentesIds?.message ? (
              <Text style={styles.errorField}>
                {errors.membrosPresentesIds.message}
              </Text>
            ) : null}

            {errors.root?.message ? (
              <Text style={styles.errorRoot}>{errors.root.message}</Text>
            ) : null}

            <View style={styles.btnWrap}>
              <Button
                variant="accent"
                title="REGISTRAR REUNIÃO"
                onPress={handleSubmit(onSubmit)}
                loading={submitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {Platform.OS === 'ios' && iosDateModalOpen ? (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={() => setIosDateModalOpen(false)}
        >
          <Pressable
            style={styles.dateModalOverlay}
            onPress={() => setIosDateModalOpen(false)}
          >
            <Pressable
              style={[
                styles.dateModalCard,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <DateTimePicker
                value={isoDateToLocalDate(dataReuniaoWatch)}
                mode="date"
                display="inline"
                themeVariant="light"
                onChange={(_, date) => {
                  if (date) {
                    setValue('dataReuniao', localDateToIso(date), {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }
                }}
              />
              <TouchableOpacity
                style={styles.dateModalDone}
                onPress={() => setIosDateModalOpen(false)}
              >
                <Text style={styles.dateModalDoneText}>Concluir</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}

      <Modal
        visible={visitorSheetOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setVisitorSheetOpen(false)}
      >
        <Pressable
          style={styles.sheetOverlay}
          onPress={() => setVisitorSheetOpen(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetAvoid}
          >
            <Pressable
              style={[styles.sheetCard, { paddingBottom: Math.max(insets.bottom, 16) }]}
              onPress={(e) => e.stopPropagation()}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled
              >
                <Text style={styles.sheetTitle}>Novo visitante</Text>
                <Text style={styles.sheetHint}>
                  Os vínculos celulaId e reuniaoId são gravados ao registrar a reunião.
                </Text>
                <Text style={styles.fieldLabel}>Nome</Text>
                <Input
                  variant="auth"
                  placeholder="Nome do visitante"
                  value={draftNome}
                  onChangeText={(t) => {
                    setDraftNome(t);
                    setDraftVisitorError('');
                  }}
                />
                <Text style={[styles.fieldLabel, styles.sheetFieldLabelSpaced]}>
                  Telefone (opcional)
                </Text>
                <Input
                  variant="auth"
                  placeholder="Telefone"
                  value={draftTelefone}
                  onChangeText={setDraftTelefone}
                  keyboardType="phone-pad"
                />
                <Text style={[styles.fieldLabel, styles.sheetFieldLabelSpaced]}>
                  Observações (opcional)
                </Text>
                <Input
                  variant="auth"
                  placeholder="Anotações sobre o visitante"
                  value={draftObservacoes}
                  onChangeText={setDraftObservacoes}
                  multiline
                />
                {draftVisitorError ? (
                  <Text style={styles.errorField}>{draftVisitorError}</Text>
                ) : null}
              </ScrollView>
              <View style={styles.sheetActions}>
                <TouchableOpacity
                  style={styles.sheetBtnSecondary}
                  onPress={() => setVisitorSheetOpen(false)}
                >
                  <Text style={styles.sheetBtnSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.sheetBtnPrimary}
                  onPress={confirmVisitor}
                >
                  <Text style={styles.sheetBtnPrimaryText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
