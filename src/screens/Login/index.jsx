import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { AuthLogo } from '../../components/AuthLogo';
import { styles } from './styles';
import { useLoginScreen } from './useLoginScreen';

export default function Login() {
  const {
    control,
    handleSubmit,
    errors,
    onSubmit,
    loading,
    goToRegistroUsuario,
  } = useLoginScreen();

  const { height: windowHeight } = useWindowDimensions();
  const scrollContentStyle = [styles.scroll, { minHeight: Math.max(windowHeight - 32, 500) }];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      {/* Decoração de fundo */}
      <View style={styles.bgCircle1} pointerEvents="none" />
      <View style={styles.bgCircle2} pointerEvents="none" />

      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 4 : 0}
      >
        <ScrollView
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.inner}>
            {/* Logo */}
            <View style={styles.logoWrap}>
              <AuthLogo />
              <Text style={styles.tagline}>Gestão de Células</Text>
            </View>

            {/* Card do formulário */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Entrar</Text>
              <Text style={styles.cardSubtitle}>Acesse sua conta para continuar</Text>

              <View style={styles.fieldBlock}>
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
                    autoComplete="password"
                    textContentType="password"
                  />
                )}
              />

              {errors.root?.message ? (
                <Text style={styles.errorRoot}>{errors.root.message}</Text>
              ) : null}

              <View style={styles.btnWrap}>
                <Button
                  variant="accent"
                  title="ENTRAR"
                  onPress={handleSubmit(onSubmit)}
                  loading={loading}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.link}
              onPress={goToRegistroUsuario}
              activeOpacity={0.85}
            >
              <Text style={styles.linkText}>Não tem uma conta? </Text>
              <Text style={styles.linkBold}>CADASTRE-SE</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
