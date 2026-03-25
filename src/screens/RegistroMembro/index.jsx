import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useRegistroMembroScreen } from './useRegistroMembroScreen';

export default function RegistroMembro() {
  const { celulaId, control, handleSubmit, errors, onSubmit } =
    useRegistroMembroScreen();

  if (!celulaId) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Célula não informada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="nomeCompleto"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nome completo"
              placeholder="Nome completo"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.nomeCompleto?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="cpfRg"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="CPF/RG"
              placeholder="CPF ou RG"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.cpfRg?.message}
            />
          )}
        />
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
          name="telefone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Telefone"
              placeholder="Telefone"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.telefone?.message}
              keyboardType="phone-pad"
            />
          )}
        />
        <Controller
          control={control}
          name="rua"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Rua"
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
              label="Número"
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
              label="Complemento"
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
              label="Bairro"
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
              label="Cidade"
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
              label="Cep"
              placeholder="CEP"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.cep?.message}
              keyboardType="number-pad"
            />
          )}
        />
        <Controller
          control={control}
          name="data"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Data"
              placeholder="Data (ex: 01/01/2020)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.data?.message}
            />
          )}
        />
        <Button title="Cadastrar" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}