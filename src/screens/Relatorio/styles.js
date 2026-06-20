import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  scrollOuter: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    backgroundColor: colors.bg,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  cardTitle: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[4],
  },

  title: {
    ...type.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...type.body,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  hint: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: 17,
    fontWeight: '400',
  },

  rowInputs: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  inputHalf: {
    flex: 1,
    minWidth: 0,
  },
  inputHalfLeft: {
    marginRight: 6,
  },
  inputHalfRight: {
    marginLeft: 6,
  },

  // Card de resumo
  cardResumo: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
  },
  resumoTitulo: {
    ...type.label,
    color: colors.primary,
    marginBottom: spacing[3],
  },
  resumoLinha: {
    ...type.body,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  resumoNum: {
    fontWeight: '800',
    color: colors.primary,
  },

  secReunioes: {
    ...type.h4,
    color: colors.text,
    marginBottom: spacing[3],
  },
  reuniaoRow: {
    paddingVertical: 13,
    paddingHorizontal: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.bgAlt,
    borderRadius: radii.md,
    marginBottom: spacing[2],
  },
  reuniaoData: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  reuniaoTema: {
    ...type.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  empty: {
    ...type.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: spacing[3],
  },
  error: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
