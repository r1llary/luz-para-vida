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
import { styles } from './styles';
import { useRegistroCelulaScreen } from './useRegistroCelulaScreen';

export default function RegistroCelula() {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    membrosFields,
    appendMembro,
    removeMembro,
    imageUri,
    pickImagem,
    removeImagem,
  } = useRegistroCelulaScreen();

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
            {/* ── Imagem de capa ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Imagem de capa (opcional)</Text>

              <TouchableOpacity style={styles.imagemWrap} onPress={pickImagem} activeOpacity={0.85}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={styles.imagemPreview} resizeMode="cover" />
                ) : (
                  <View style={styles.imagemPlaceholder}>
                    <View style={styles.imagemPlaceholderIcon}>
                      <Text style={styles.imagemPlaceholderIconText}>📷</Text>
                    </View>
                    <Text style={styles.imagemPlaceholderText}>Toque para adicionar uma foto</Text>
                  </View>
                )}
              </TouchableOpacity>

              {imageUri ? (
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

            {/* ── Informações principais ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Informações principais</Text>
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Dia (ex.: Segunda-feira)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.dia?.message}
                  />
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
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Membros iniciais (opcional)</Text>
              {membrosFields.map((field, index) => (
                <View key={field.id} style={styles.membroBlock}>
                  <Controller
                    control={control}
                    name={`membrosIniciais.${index}.nomeCompleto`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        variant="auth"
                        placeholder="Nome completo"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.membrosIniciais?.[index]?.nomeCompleto?.message}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name={`membrosIniciais.${index}.telefone`}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        variant="auth"
                        placeholder="Telefone (opcional)"
                        value={value ?? ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="phone-pad"
                      />
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => removeMembro(index)}
                    accessibilityRole="button"
                    accessibilityLabel="Remover membro"
                  >
                    <Text style={styles.removeMembro}>Remover</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity
                onPress={appendMembro}
                accessibilityRole="button"
                accessibilityLabel="Adicionar membro"
              >
                <Text style={styles.addMembro}>+ Adicionar membro</Text>
              </TouchableOpacity>

              <Text style={styles.hint}>
                As reuniões da célula são registradas depois, na tela de detalhes.
              </Text>

              {errors.root?.message ? (
                <Text style={styles.errorRoot}>{errors.root.message}</Text>
              ) : null}

              <View style={styles.btnWrap}>
                <Button
                  variant="accent"
                  title="CADASTRAR"
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
