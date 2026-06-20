import { StyleSheet } from 'react-native';
import { colors, radii, type } from '../../theme';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerAuth: {
    marginBottom: 14,
  },
  label: {
    ...type.label,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputFocus: {
    borderColor: colors.borderFocus,
  },
  inputError: {
    borderColor: colors.error,
  },
  inputAuth: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputAuthError: {
    borderColor: colors.error,
  },
  error: {
    ...type.caption,
    color: colors.error,
    marginTop: 4,
  },
  errorAuth: {
    ...type.caption,
    color: colors.error,
    marginTop: 4,
    fontWeight: '600',
  },
});
