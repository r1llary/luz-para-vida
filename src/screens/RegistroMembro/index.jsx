import React from 'react';
import {
  View,
  Text,
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
import { useRegistroMembroScreen } from './useRegistroMembroScreen';

export default function RegistroMembro() {
  const {
    celulaId,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
  } = useRegistroMembroScreen();

  if (!celulaId) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.errorWrap}>
          <Text style={styles.error}>Célula não informada.</Text>
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
          bounces
        >
          <View style={styles.inner}>
            <AuthLogo style={styles.logoSpacer} />
            <Text style={styles.title}>NOVO MEMBRO</Text>
            <Text style={styles.subtitle}>
              Cadastre os dados do participante da célula
            </Text>

            <Text style={styles.sectionLabel}>Dados pessoais</Text>
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
              name="telefone"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Telefone (com DDD)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.telefone?.message}
                  keyboardType="phone-pad"
                  textContentType="telephoneNumber"
                />
              )}
            />
            <Controller
              control={control}
              name="data"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Data (ex.: 01/01/2020)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.data?.message}
                />
              )}
            />

            <Text style={styles.sectionLabel}>Endereço</Text>
            <Controller
              control={control}
              name="rua"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Rua"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.rua?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="numero"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Número"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.numero?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="complemento"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Complemento (opcional)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="bairro"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Bairro"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.bairro?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="cidade"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Cidade"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cidade?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="cep"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="CEP"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cep?.message}
                  keyboardType="number-pad"
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
                loading={submitting}
              />
            </View>
          </View>

          <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
