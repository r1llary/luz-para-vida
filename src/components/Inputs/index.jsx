import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { useInput } from './useInput';

export function Input({
  label,
  error,
  secureTextEntry,
  passwordToggle,
  variant = 'default',
  style,
  ...props
}) {
  const { inputStyle } = useInput({ error, variant });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const effectiveSecure = passwordToggle
    ? !passwordVisible
    : !!secureTextEntry;

  const inputProps = {
    placeholderTextColor: '#999',
    secureTextEntry: effectiveSecure,
    ...props,
  };

  return (
    <View style={[styles.container, variant === 'auth' && styles.containerAuth]}>
      {label && variant !== 'auth' ? (
        <Text style={styles.label}>{label}</Text>
      ) : null}
      {passwordToggle && variant === 'auth' ? (
        <View
          style={[
            styles.passwordShell,
            error && styles.passwordShellError,
          ]}
        >
          <TextInput style={styles.passwordInput} {...inputProps} />
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={() => setPasswordVisible((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
          >
            <Text style={styles.passwordToggleText}>
              {passwordVisible ? 'Ocultar' : 'Mostrar'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput style={[inputStyle, style]} {...inputProps} />
      )}
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
