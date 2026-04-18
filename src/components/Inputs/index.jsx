import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './styles';
import { useInput } from './useInput';

export function Input({
  label,
  error,
  secureTextEntry,
  variant = 'default',
  ...props
}) {
  const { inputStyle } = useInput({ error, variant });

  return (
    <View style={[styles.container, variant === 'auth' && styles.containerAuth]}>
      {label && variant !== 'auth' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      <TextInput
        style={inputStyle}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        {...props}
      />
      {error ? (
        <Text
          style={variant === 'auth' ? styles.errorAuth : styles.error}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
