import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useRelatorioScreen } from './useRelatorioScreen';

export default function Relatorio() {
  const { celula, control, handleSubmit, errors, onSubmit } = useRelatorioScreen();

  if (!celula) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Célula não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>RELATÓRIO</Text>
        <Text style={styles.subtitle}>{celula.nomeCelula}</Text>

        <Controller
          control={control}
          name="temaMinistrado"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Tema ministrado"
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
        <Button title="SALVAR" onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}
