import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useRegistroCelulaScreen } from './useRegistroCelulaScreen';

export default function RegistroCelula() {
  const { control, handleSubmit, errors, onSubmit } = useRegistroCelulaScreen();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Controller
          control={control}
          name="nomeCelula"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Nome da Célula"
              placeholder="Nome da Célula"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.nomeCelula?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="local"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Local"
              placeholder="Local"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.local?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="endereco"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Endereço"
              placeholder="Endereço"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.endereco?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="dia"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Dia"
              placeholder="Ex: Segunda-feira"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.dia?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="horario"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Horário"
              placeholder="Ex: 18h"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.horario?.message}
            />
          )}
        />
        <Controller
          control={control}
          name="celulaRaiz"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Célula raiz"
              placeholder="Célula raiz (opcional)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Text style={styles.hint}>
          Escolha uma imagem que represente a sua célula (em breve)
        </Text>
        <Controller
          control={control}
          name="temaMinistrado"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Tema ministrado"
              placeholder="Tema ministrado (opcional)"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name="textoBase"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Texto base"
              placeholder="Texto base (opcional)"
              value={value}
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
              label="Visitantes"
              placeholder="0"
              value={value === 0 ? '' : String(value)}
              onChangeText={(v) => onChange(v ? Number(v) : 0)}
              onBlur={onBlur}
              error={errors.visitantes?.message}
              keyboardType="number-pad"
            />
          )}
        />
        <Controller
          control={control}
          name="membrosPresentes"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Membros presentes"
              placeholder="0"
              value={value === 0 ? '' : String(value)}
              onChangeText={(v) => onChange(v ? Number(v) : 0)}
              onBlur={onBlur}
              error={errors.membrosPresentes?.message}
              keyboardType="number-pad"
            />
          )}
        />
        <Button title="Cadastrar" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}
