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
import { UsuarioCadastroFields } from '../../components/UsuarioCadastroFields';
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
    maskDateDMY,
    onCepChangeText,
    onCepFilled,
    cepLookupLoading,
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
            <UsuarioCadastroFields
              control={control}
              errors={errors}
              maskDateDMY={maskDateDMY}
              onCepChangeText={onCepChangeText}
              onCepFilled={onCepFilled}
              cepLookupLoading={cepLookupLoading}
              omitSenha
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
