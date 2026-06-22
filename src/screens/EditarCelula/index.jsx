import React from 'react';
import {
  View,
  Text,
  Image,
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
import { styles } from '../RegistroCelula/styles';
import { useEditarCelulaScreen } from './useEditarCelulaScreen';

const DIAS_SEMANA = [
  { abrev: 'Dom', full: 'Domingo' },
  { abrev: 'Seg', full: 'Segunda-feira' },
  { abrev: 'Ter', full: 'Terça-feira' },
  { abrev: 'Qua', full: 'Quarta-feira' },
  { abrev: 'Qui', full: 'Quinta-feira' },
  { abrev: 'Sex', full: 'Sexta-feira' },
  { abrev: 'Sáb', full: 'Sábado' },
];

export default function EditarCelula() {
  const {
    celula,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    imageUri,
    pickImagem,
    removeImagem,
  } = useEditarCelulaScreen();

  const previewUri = imageUri ?? celula?.imagemUrl ?? null;

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
          bounces
        >
          <View style={styles.inner}>
            {/* Imagem de capa */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Imagem de capa (opcional)</Text>
              <TouchableOpacity style={styles.imagemWrap} onPress={pickImagem} activeOpacity={0.85}>
                {previewUri ? (
                  <Image source={{ uri: String(previewUri) }} style={styles.imagemPreview} resizeMode="cover" />
                ) : (
                  <View style={styles.imagemPlaceholder}>
                    <View style={styles.imagemPlaceholderIcon}>
                      <Text style={styles.imagemPlaceholderIconText}>📷</Text>
                    </View>
                    <Text style={styles.imagemPlaceholderText}>Toque para adicionar uma foto</Text>
                  </View>
                )}
              </TouchableOpacity>
              {previewUri ? (
                <View style={styles.imagemAcoes}>
                  <TouchableOpacity style={styles.imagemBtn} onPress={pickImagem} activeOpacity={0.85}>
                    <Text style={styles.imagemBtnText}>Trocar foto</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.imagemBtn, styles.imagemBtnRemover]} onPress={removeImagem} activeOpacity={0.85}>
                    <Text style={styles.imagemBtnRemoverText}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>

            {/* Informações */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informações da célula</Text>
              <Controller
                control={control}
                name="nomeCelula"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Nome da célula"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.nomeCelula?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="dia"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.diasWrap}>
                    <Text style={styles.diasLabel}>Dia da semana</Text>
                    <View style={styles.diasRow}>
                      {DIAS_SEMANA.map((d) => (
                        <TouchableOpacity
                          key={d.full}
                          style={[styles.diaBtn, value === d.full && styles.diaBtnAtivo]}
                          onPress={() => onChange(d.full)}
                          activeOpacity={0.8}
                        >
                          <Text style={[styles.diaBtnText, value === d.full && styles.diaBtnTextoAtivo]}>
                            {d.abrev}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    {errors.dia?.message ? (
                      <Text style={styles.diaError}>{errors.dia.message}</Text>
                    ) : null}
                  </View>
                )}
              />
              <Controller
                control={control}
                name="horario"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Horário (ex.: 18h)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.horario?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="local"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Endereço completo (abre no Maps)"
                    value={value ?? ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />

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

          <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
