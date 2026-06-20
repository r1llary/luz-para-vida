import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { AuthLogo } from '../../components/AuthLogo';
import { styles } from './styles';
import { useRegistroUsuarioScreen } from './useRegistroUsuarioScreen';

export default function RegistroUsuario() {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    goToLogin,
    permissao,
    setPermissao,
  } = useRegistroUsuarioScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      <View style={styles.bgCircle1} pointerEvents="none" />
      <View style={styles.bgCircle2} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.inner}>
            {/* Logo */}
            <View style={styles.logoWrap}>
              <AuthLogo style={styles.logoSpacer} />
              <Text style={styles.tagline}>Gestão de Células</Text>
            </View>

            {/* Card do formulário */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Criar conta</Text>
              <Text style={styles.cardSubtitle}>
                Preencha seus dados para se cadastrar
              </Text>

              {/* Seletor de perfil */}
              <Text style={styles.roleSectionLabel}>Seu perfil no app</Text>
              <View style={styles.roleRow}>
                <TouchableOpacity
                  style={[styles.roleBtn, permissao === 'lider' && styles.roleBtnActive]}
                  onPress={() => setPermissao('lider')}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityLabel="Líder"
                  accessibilityState={{ selected: permissao === 'lider' }}
                >
                  <Text style={[styles.roleBtnLabel, permissao === 'lider' && styles.roleBtnLabelActive]}>
                    Líder
                  </Text>
                  <Text style={[styles.roleBtnDesc, permissao === 'lider' && styles.roleBtnDescActive]}>
                    Gerencia células
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleBtn, permissao === 'membro' && styles.roleBtnActive]}
                  onPress={() => setPermissao('membro')}
                  activeOpacity={0.8}
                  accessibilityRole="radio"
                  accessibilityLabel="Membro"
                  accessibilityState={{ selected: permissao === 'membro' }}
                >
                  <Text style={[styles.roleBtnLabel, permissao === 'membro' && styles.roleBtnLabelActive]}>
                    Membro
                  </Text>
                  <Text style={[styles.roleBtnDesc, permissao === 'membro' && styles.roleBtnDescActive]}>
                    Participa de células
                  </Text>
                </TouchableOpacity>
              </View>

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
              <Controller
                control={control}
                name="senha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.senha?.message}
                    secureTextEntry
                    autoComplete="password-new"
                    textContentType="newPassword"
                  />
                )}
              />
              <Controller
                control={control}
                name="confirmarSenha"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="Confirmar senha"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmarSenha?.message}
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
                  title="CADASTRAR"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.link}
              onPress={goToLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.linkText}>Já tem uma conta? </Text>
              <Text style={styles.linkBold}>ENTRE</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Luz para Vida · Camila Guimaraes</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
