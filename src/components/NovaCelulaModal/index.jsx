import React from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  StyleSheet,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Controller } from 'react-hook-form';
import { Input } from '../Inputs';
import { Button } from '../Buttons';
import { styles } from './styles';
import { useNovaCelulaModal } from './useNovaCelulaModal';
import { DIAS_SEMANA_OPCOES } from '../../constants/diasSemana';

const androidFillProps =
  Platform.OS === 'android'
    ? { importantForAutofill: 'no' }
    : {};

export function NovaCelulaModal({ visible, onClose, onCreated }) {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    imagemUri,
    pickFromLibrary,
    pickFromCamera,
    clearImagem,
    diaModalOpen,
    setDiaModalOpen,
    selectDia,
    timePickerOpen,
    iosTimeDraft,
    openTimePicker,
    onAndroidTimeChange,
    onIosTimeChange,
    confirmIosTime,
    cancelTimePicker,
    opcoesCelulaRaiz,
    celulaRaizModalOpen,
    setCelulaRaizModalOpen,
    selectCelulaRaizId,
  } = useNovaCelulaModal({ visible, onClose, onCreated });

  const nomeInputExtra = {
    keyboardType: 'default',
    autoCapitalize: 'words',
    autoCorrect: true,
    textContentType: 'none',
    autoComplete: 'off',
    ...androidFillProps,
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheetWrap}>
            <Pressable
              style={[StyleSheet.absoluteFillObject, styles.dim]}
              onPress={onClose}
              accessibilityLabel="Fechar"
            />
            <View style={styles.card}>
              <Text style={styles.title}>Nova célula</Text>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.sectionLabel}>Dados da célula</Text>
                <Text style={styles.fieldHint}>
                  Nome com acentuação livre; local e endereço completos; dia da
                  semana padronizado; horário em 24h (ex.: 19:30h). Imagem de
                  destaque é opcional.
                </Text>

                <Text style={styles.inputLabel}>Nome da célula</Text>
                <Controller
                  control={control}
                  name="nomeCelula"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Ex.: Célula Vida"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.nomeCelula?.message}
                      {...nomeInputExtra}
                    />
                  )}
                />

                <Text style={styles.inputLabel}>Local</Text>
                <Controller
                  control={control}
                  name="local"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Ex.: Casa do irmão João, Salão social"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.local?.message}
                      {...nomeInputExtra}
                    />
                  )}
                />

                <Text style={styles.inputLabel}>Endereço</Text>
                <Controller
                  control={control}
                  name="endereco"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      placeholder="Logradouro, número, bairro, cidade, CEP…"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.endereco?.message}
                      multiline
                      numberOfLines={4}
                      style={styles.textArea}
                      textAlignVertical="top"
                      {...androidFillProps}
                    />
                  )}
                />

                <Text style={styles.inputLabel}>Dia da semana</Text>
                <Controller
                  control={control}
                  name="dia"
                  render={({ field: { value } }) => (
                    <View>
                      <Pressable
                        style={[
                          styles.pickerField,
                          errors.dia?.message && styles.pickerFieldError,
                        ]}
                        onPress={() => setDiaModalOpen(true)}
                        accessibilityRole="button"
                        accessibilityLabel="Escolher dia da semana"
                      >
                        <Text
                          style={
                            value ? styles.pickerFieldText : styles.pickerPlaceholder
                          }
                          numberOfLines={2}
                        >
                          {value || 'Selecione o dia da semana'}
                        </Text>
                      </Pressable>
                      {errors.dia?.message ? (
                        <Text style={styles.fieldError}>{errors.dia.message}</Text>
                      ) : null}
                    </View>
                  )}
                />

                <Text style={styles.inputLabel}>Horário</Text>
                {Platform.OS === 'web' ? (
                  <Controller
                    control={control}
                    name="horario"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Ex.: 19:30h"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.horario?.message}
                        keyboardType="default"
                        autoComplete="off"
                      />
                    )}
                  />
                ) : (
                  <View>
                    <Controller
                      control={control}
                      name="horario"
                      render={({ field: { value } }) => (
                        <Pressable
                          style={[
                            styles.pickerField,
                            errors.horario?.message && styles.pickerFieldError,
                          ]}
                          onPress={openTimePicker}
                          accessibilityRole="button"
                          accessibilityLabel="Escolher horário"
                        >
                          <Text
                            style={
                              value
                                ? styles.pickerFieldText
                                : styles.pickerPlaceholder
                            }
                          >
                            {value || 'Selecione o horário'}
                          </Text>
                        </Pressable>
                      )}
                    />
                    {errors.horario?.message ? (
                      <Text style={styles.fieldError}>
                        {errors.horario.message}
                      </Text>
                    ) : null}

                    {Platform.OS === 'android' && timePickerOpen ? (
                      <DateTimePicker
                        value={iosTimeDraft}
                        mode="time"
                        is24Hour
                        display="default"
                        onChange={onAndroidTimeChange}
                      />
                    ) : null}
                  </View>
                )}

                {opcoesCelulaRaiz.length > 0 ? (
                  <>
                    <Text style={styles.inputLabel}>Célula raiz (opcional)</Text>
                    <Text style={styles.fieldHint}>
                      Apenas células em que você é líder.
                    </Text>
                    <Controller
                      control={control}
                      name="celulaRaiz"
                      render={({ field: { value } }) => {
                        const sel = opcoesCelulaRaiz.find(
                          (c) => c.id === value,
                        );
                        const display = sel?.nomeCelula;
                        return (
                          <View>
                            <Pressable
                              style={[
                                styles.pickerField,
                                errors.celulaRaiz?.message &&
                                  styles.pickerFieldError,
                              ]}
                              onPress={() => setCelulaRaizModalOpen(true)}
                              accessibilityRole="button"
                              accessibilityLabel="Escolher célula raiz"
                            >
                              <Text
                                style={
                                  display
                                    ? styles.pickerFieldText
                                    : styles.pickerPlaceholder
                                }
                                numberOfLines={2}
                              >
                                {display || 'Sem célula raiz'}
                              </Text>
                            </Pressable>
                            {errors.celulaRaiz?.message ? (
                              <Text style={styles.fieldError}>
                                {errors.celulaRaiz.message}
                              </Text>
                            ) : null}
                          </View>
                        );
                      }}
                    />
                  </>
                ) : null}

                <Text style={styles.sectionLabel}>Imagem de destaque</Text>
                <Text style={styles.fieldHint}>Opcional — galeria ou câmera.</Text>
                <View style={styles.imagemPreviewWrap}>
                  {imagemUri ? (
                    <Image
                      source={{ uri: imagemUri }}
                      style={styles.imagemPreview}
                      resizeMode="cover"
                    />
                  ) : (
                    <Text style={styles.imagemPlaceholder}>
                      Galeria ou câmera
                    </Text>
                  )}
                </View>
                <View style={styles.imagemActions}>
                  <Pressable
                    style={styles.imagemBtn}
                    onPress={pickFromLibrary}
                    accessibilityRole="button"
                    accessibilityLabel="Escolher da galeria"
                  >
                    <Text style={styles.imagemBtnText}>Galeria</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.imagemBtn, styles.imagemBtnSpacer]}
                    onPress={pickFromCamera}
                    accessibilityRole="button"
                    accessibilityLabel="Tirar foto"
                  >
                    <Text style={styles.imagemBtnText}>Câmera</Text>
                  </Pressable>
                  {imagemUri ? (
                    <Pressable
                      style={[styles.imagemBtn, styles.imagemBtnDanger]}
                      onPress={clearImagem}
                      accessibilityRole="button"
                      accessibilityLabel="Remover imagem"
                    >
                      <Text
                        style={[styles.imagemBtnText, styles.imagemBtnDangerText]}
                      >
                        Remover
                      </Text>
                    </Pressable>
                  ) : null}
                </View>

                {errors.root?.message ? (
                  <Text style={styles.errorRoot}>{errors.root.message}</Text>
                ) : null}

                <View style={styles.rowActions}>
                  <Pressable style={styles.btnGhost} onPress={onClose}>
                    <Text style={styles.btnGhostText}>Cancelar</Text>
                  </Pressable>
                </View>
                <View style={styles.btnWrap}>
                  <Button
                    variant="accent"
                    title="Cadastrar"
                    onPress={handleSubmit(onSubmit)}
                    loading={submitting}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={diaModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDiaModalOpen(false)}
      >
        <View style={styles.diaOverlay}>
          <Pressable
            style={styles.diaBackdropPress}
            onPress={() => setDiaModalOpen(false)}
            accessibilityLabel="Fechar lista"
          />
          <View style={styles.diaSheet}>
            <Text style={styles.diaSheetTitle}>Dia da semana</Text>
            <ScrollView style={styles.diaList} keyboardShouldPersistTaps="handled">
              {DIAS_SEMANA_OPCOES.map((dia) => (
                <Pressable
                  key={dia}
                  style={styles.diaOption}
                  onPress={() => selectDia(dia)}
                >
                  <Text style={styles.diaOptionText}>{dia}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.diaCancel}
              onPress={() => setDiaModalOpen(false)}
            >
              <Text style={styles.diaCancelText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        visible={celulaRaizModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCelulaRaizModalOpen(false)}
      >
        <View style={styles.diaOverlay}>
          <Pressable
            style={styles.diaBackdropPress}
            onPress={() => setCelulaRaizModalOpen(false)}
            accessibilityLabel="Fechar lista"
          />
          <View style={styles.diaSheet}>
            <Text style={styles.diaSheetTitle}>Célula raiz</Text>
            <ScrollView style={styles.diaList} keyboardShouldPersistTaps="handled">
              <Pressable
                style={styles.diaOption}
                onPress={() => selectCelulaRaizId('')}
              >
                <Text style={styles.diaOptionText}>Sem célula raiz</Text>
              </Pressable>
              {opcoesCelulaRaiz.map((c) => (
                <Pressable
                  key={c.id}
                  style={styles.diaOption}
                  onPress={() => selectCelulaRaizId(c.id)}
                >
                  <Text style={styles.diaOptionText}>{c.nomeCelula || c.id}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable
              style={styles.diaCancel}
              onPress={() => setCelulaRaizModalOpen(false)}
            >
              <Text style={styles.diaCancelText}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={timePickerOpen}
          transparent
          animationType="fade"
          onRequestClose={cancelTimePicker}
        >
          <View style={styles.timeIosOverlay}>
            <View style={styles.timeIosCard}>
              <Text style={styles.timeIosTitle}>Horário</Text>
              <DateTimePicker
                value={iosTimeDraft}
                mode="time"
                is24Hour
                display="spinner"
                locale="pt-BR"
                onChange={onIosTimeChange}
                style={styles.timeIosPicker}
              />
              <View style={styles.timeIosActions}>
                <Pressable style={styles.timeIosBtnGhost} onPress={cancelTimePicker}>
                  <Text style={styles.timeIosBtnGhostText}>Cancelar</Text>
                </Pressable>
                <Pressable style={styles.timeIosBtnOk} onPress={confirmIosTime}>
                  <Text style={styles.timeIosBtnOkText}>OK</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
