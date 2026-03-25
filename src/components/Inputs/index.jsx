import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './styles';
import { useInput } from './useInput';

export function Input({
  label,
  error,
  secureTextEntry,
  ...props
}) {
  const { inputStyle } = useInput({ error });

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={inputStyle}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}
