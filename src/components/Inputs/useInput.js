import { useMemo } from 'react';
import { styles } from './styles';

export function useInput({ error, variant = 'default' }) {
  const inputStyle = useMemo(() => {
    const base =
      variant === 'auth'
        ? styles.inputAuth
        : styles.input;
    const err =
      variant === 'auth'
        ? styles.inputAuthError
        : styles.inputError;
    return [base, error && err];
  }, [error, variant]);

  return { inputStyle };
}
