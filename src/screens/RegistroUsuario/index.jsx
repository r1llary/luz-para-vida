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
import { AuthLogo } from '../../components/AuthLogo';
import { UsuarioCadastroFields } from '../../components/UsuarioCadastroFields';
import { Button } from '../../components/Buttons';
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
    maskDateDMY,
    onCepChangeText,
    onCepFilled,
    cepLookupLoading,
  } = useRegistroUsuarioScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
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
            <AuthLogo style={styles.logoSpacer} />
            <Text style={styles.title}>CRIAR CONTA</Text>
            <Text style={styles.subtitle}>
              Preencha seus dados para se cadastrar
            </Text>

            <Text style={styles.permissaoHint}>
              Permissão padrão: membro. A foto de perfil pode ser adicionada
              depois em Perfil.
            </Text>

            <UsuarioCadastroFields
              control={control}
              errors={errors}
              maskDateDMY={maskDateDMY}
              onCepChangeText={onCepChangeText}
              onCepFilled={onCepFilled}
              cepLookupLoading={cepLookupLoading}
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

            <TouchableOpacity
              style={styles.link}
              onPress={goToLogin}
              activeOpacity={0.85}
            >
              <Text style={styles.linkText}>Já tem uma conta? </Text>
              <Text style={styles.linkBold}>ENTRE</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
