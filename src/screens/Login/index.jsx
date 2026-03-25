import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Luz para Vida</Text>
        <Text style={styles.subtitle}>Entre na sua conta</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Email"
              placeholder="Email"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        />
        <Controller
          control={control}
          name="senha"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Senha"
              placeholder="Senha"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.senha?.message}
              secureTextEntry
            />
          )}
        />

        {errors.root?.message ? (
          <Text style={styles.errorRoot}>{errors.root.message}</Text>
        ) : null}

        <Button
          title="ENTRAR"
          onPress={handleSubmit(onSubmit)}
          loading={loading}
        />

        <TouchableOpacity style={styles.link} onPress={goToRegistroUsuario}>
          <Text style={styles.linkText}>Não tem uma conta? </Text>
          <Text style={styles.linkBold}>CADASTRE-SE</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.footer}>Powered by Ana Rillary</Text>
    </ScrollView>
  );
}
