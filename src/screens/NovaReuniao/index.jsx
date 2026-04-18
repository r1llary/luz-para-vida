import React from 'react';
import {
  View,
  Text,
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
import { AuthLogo } from '../../components/AuthLogo';
import { styles } from './styles';
import { useNovaReuniaoScreen } from './useNovaReuniaoScreen';

export default function NovaReuniao() {
  const {
    celula,
    membros,
    control,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
  } = useNovaReuniaoScreen();

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
            <AuthLogo style={{ marginBottom: 12 }} />
            <Text style={styles.title}>NOVA REUNIÃO</Text>
            <Text style={styles.subtitle}>{celula.nomeCelula}</Text>

            <Controller
              control={control}
              name="dataReuniao"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Data (AAAA-MM-DD)"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dataReuniao?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="temaMinistrado"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Tema ministrado"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.temaMinistrado?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="textoBase"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Texto base (opcional)"
                  value={value ?? ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              )}
            />
            <Controller
              control={control}
              name="visitantes"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Número de visitantes"
                  value={value === 0 ? '' : String(value)}
                  onChangeText={(v) => onChange(v ? Number(v) : 0)}
                  onBlur={onBlur}
                  error={errors.visitantes?.message}
                  keyboardType="number-pad"
                />
              )}
            />

            <Text style={styles.presencaLabel}>Membros presentes</Text>
            <Text style={styles.presencaHint}>
              Toque para marcar ou desmarcar a presença de cada membro
              cadastrado na célula.
            </Text>
            <Controller
              control={control}
              name="membrosPresentesIds"
              render={({ field: { value, onChange } }) => {
                const selected = Array.isArray(value) ? value : [];
                const toggle = (membroId) => {
                  if (selected.includes(membroId)) {
                    onChange(selected.filter((id) => id !== membroId));
                  } else {
                    onChange([...selected, membroId]);
                  }
                };

                if (membros.length === 0) {
                  return (
                    <Text style={styles.semMembros}>
                      Nenhum membro cadastrado nesta célula. Cadastre membros
                      no detalhe da célula para registrar presença por nome.
                    </Text>
                  );
                }

                return (
                  <View style={styles.membrosBox}>
                    {membros.map((m) => {
                      const ativo = selected.includes(m.id);
                      return (
                        <TouchableOpacity
                          key={m.id}
                          style={[
                            styles.membroLinha,
                            ativo && styles.membroLinhaAtiva,
                          ]}
                          onPress={() => toggle(m.id)}
                          activeOpacity={0.85}
                          accessibilityRole="checkbox"
                          accessibilityState={{ checked: ativo }}
                        >
                          <Text style={styles.membroCheck}>
                            {ativo ? '☑' : '☐'}
                          </Text>
                          <Text
                            style={styles.membroNome}
                            numberOfLines={2}
                          >
                            {m.nomeCompleto}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              }}
            />
            {errors.membrosPresentesIds?.message ? (
              <Text style={styles.errorField}>
                {errors.membrosPresentesIds.message}
              </Text>
            ) : null}

            <Text style={styles.hint}>
              Use a data como identificador da reunião na lista da célula.
            </Text>

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

          <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
