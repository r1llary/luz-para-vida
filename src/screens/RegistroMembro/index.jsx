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
    buscarEmail,
    setBuscarEmail,
    buscando,
    buscarMembro,
    resultadoBusca,
    buscarCep,
    buscandoCep,
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

            {/* ── Busca por conta existente ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Buscar membro existente</Text>
              <Text style={styles.searchHint}>
                Se o membro já tem conta no app, busque pelo e-mail para preencher os dados automaticamente.
              </Text>
              <Input
                variant="auth"
                placeholder="E-mail cadastrado no app"
                value={buscarEmail}
                onChangeText={setBuscarEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
              />
              <View style={styles.searchBtnWrap}>
                <Button
                  variant="primary"
                  title="Buscar"
                  onPress={buscarMembro}
                  loading={buscando}
                  disabled={!buscarEmail.trim() || buscando}
                />
              </View>

              {resultadoBusca?.encontrado === true && (
                <View style={styles.buscaResultado}>
                  <Text style={styles.buscaResultadoText}>
                    ✓ Dados preenchidos para {resultadoBusca.nome}. Revise e complete o endereço abaixo.
                  </Text>
                </View>
              )}
              {resultadoBusca?.encontrado === false && (
                <View style={[styles.buscaResultado, styles.buscaResultadoNeutro]}>
                  <Text style={styles.buscaResultadoNeutroText}>
                    {resultadoBusca.erro
                      ? `Erro ao buscar: ${resultadoBusca.erro}`
                      : 'Nenhuma conta encontrada. Preencha os dados manualmente abaixo.'}
                  </Text>
                </View>
              )}
            </View>

            {/* ── Dados pessoais ── */}
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
                    placeholder="Data de nascimento (DD/MM/AAAA)"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.data?.message}
                  />
                )}
              />
            </View>

            {/* ── Endereço ── */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Endereço</Text>
              <Controller
                control={control}
                name="cep"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    variant="auth"
                    placeholder="CEP (preenche o endereço automaticamente)"
                    value={value}
                    onChangeText={(v) => {
                      onChange(v);
                      if (v.replace(/\D/g, '').length === 8) buscarCep(v);
                    }}
                    onBlur={onBlur}
                    error={errors.cep?.message}
                    keyboardType="number-pad"
                    maxLength={9}
                  />
                )}
              />
              {buscandoCep ? (
                <Text style={styles.cepCarregando}>Buscando endereço...</Text>
              ) : null}
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
