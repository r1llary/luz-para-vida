import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { colors } from '../../theme';
import { useEditarPerfilScreen } from './useEditarPerfilScreen';

export default function EditarPerfil() {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    user,
    fotoUri,
    removeFoto,
    pickFoto,
    clearFotoEscolha,
  } = useEditarPerfilScreen();

  const previewUri =
    fotoUri ||
    (!removeFoto && user?.fotoPerfilUrl ? String(user.fotoPerfilUrl) : null);

  const temFotoVisivel = !!(fotoUri || (!removeFoto && user?.fotoPerfilUrl));

  if (!user) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingWrap]} edges={['bottom']}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color={colors.primary} />
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
          bounces
        >
          <View style={styles.inner}>
            {/* Foto de perfil */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Foto de perfil</Text>
              <View style={styles.fotoSection}>
                <View style={styles.fotoRow}>
                  {temFotoVisivel && previewUri ? (
                    <Image source={{ uri: previewUri }} style={styles.fotoPreview} />
                  ) : (
                    <View style={[styles.fotoPreview, { opacity: 0.4 }]} />
                  )}
                  <View style={styles.fotoActions}>
                    <TouchableOpacity style={styles.fotoBtn} onPress={pickFoto}>
                      <Text style={styles.fotoBtnText}>
                        {temFotoVisivel ? 'Trocar foto' : 'Adicionar foto'}
                      </Text>
                    </TouchableOpacity>
                    {temFotoVisivel ? (
                      <TouchableOpacity
                        style={[styles.fotoBtn, styles.fotoBtnOutline]}
                        onPress={clearFotoEscolha}
                      >
                        <Text style={styles.fotoBtnMutedText}>Remover foto</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </View>
              </View>
            </View>

            {/* Permissão (somente leitura) */}
            <View style={styles.permissaoBox}>
              <Text style={styles.permissaoLabel}>Permissão</Text>
              <Text style={styles.permissaoValue}>
                {{ lider: 'Líder', admin: 'Administrador', membro: 'Membro' }[user.permissao] ?? 'Membro'}
              </Text>
            </View>

            {/* Dados pessoais */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Dados pessoais</Text>
              <Controller
                control={control}
                name="nomeCompleto"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Nome completo"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.nomeCompleto?.message}
                    autoComplete="name"
                    textContentType="name"
                  />
                )}
              />
              <Controller
                control={control}
                name="dataNascimento"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Data de nascimento (DD/MM/AAAA)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.dataNascimento?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="endereco"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Endereço (rua, número, bairro, cidade)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.endereco?.message}
                    textContentType="fullStreetAddress"
                  />
                )}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                  />
                )}
              />
            </View>

            {/* Segurança */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Segurança</Text>
              <Text style={styles.hint}>
                Preencha a senha atual apenas se quiser alterar email ou definir nova senha.
              </Text>
              <Controller
                control={control}
                name="senhaAtual"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Senha atual (ao mudar email ou senha)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.senhaAtual?.message}
                    secureTextEntry
                    autoComplete="password"
                    textContentType="password"
                  />
                )}
              />
              <Controller
                control={control}
                name="novaSenha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Nova senha (opcional)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.novaSenha?.message}
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmarNovaSenha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Confirmar nova senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmarNovaSenha?.message}
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
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
                  loading={loading}
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
