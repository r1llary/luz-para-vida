import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#2563eb',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2563eb',
  },
  accent: {
    backgroundColor: '#F28537',
    borderRadius: 10,
    paddingVertical: 16,
    minHeight: 52,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  text_primary: {
    color: '#fff',
  },
  text_secondary: {
    color: '#2563eb',
  },
  text_accent: {
    color: '#fff',
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
