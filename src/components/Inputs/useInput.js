import { useMemo } from 'react';
import { styles } from './styles';

export function useInput({ error }) {
  const inputStyle = useMemo(
    () => [styles.input, error && styles.inputError],
    [error],
  );

  return { inputStyle };
}
