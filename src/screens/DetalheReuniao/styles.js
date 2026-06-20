import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
  },

  // Cabeçalho da reunião
  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[3],
    ...shadows.md,
    alignItems: 'center',
  },
  celulaNome: {
    ...type.caption,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  title: {
    ...type.h2,
    color: '#fff',
    textAlign: 'center',
  },
  accentBar: {
    height: 3,
    width: 48,
    backgroundColor: colors.accent,
    borderRadius: 2,
    marginTop: spacing[3],
  },

  // Seções de detalhe
  detailCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  row: {
    marginBottom: spacing[4],
    paddingBottom: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  rowLast: {
    marginBottom: 0,
    paddingBottom: 0,
    borderBottomWidth: 0,
  },
  label: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: 6,
  },
  value: {
    ...type.body,
    color: colors.text,
    lineHeight: 22,
  },
  presencaList: {
    marginTop: 4,
    gap: 6,
  },
  presencaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  presencaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  presencaText: {
    ...type.body,
    color: colors.text,
  },

  empty: {
    ...type.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing[10],
  },
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[5],
    opacity: 0.5,
  },
});
