import { StyleSheet } from 'react-native';
import { colors, radii, shadows, type } from '../../theme';

export const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.md,
  },
  accent: {
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 16,
    minHeight: 52,
    ...shadows.md,
  },
  text: {
    ...type.body,
    fontWeight: '700',
  },
  text_primary: {
    color: colors.textInverse,
    letterSpacing: 0.3,
  },
  text_secondary: {
    color: colors.primary,
    letterSpacing: 0.3,
  },
  text_accent: {
    color: colors.textInverse,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
