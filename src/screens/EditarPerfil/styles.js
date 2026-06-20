import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  kav: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[8],
  },
  inner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },

  // Card principal
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

  sectionLabel: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[3],
    marginTop: spacing[2],
  },

  // Foto de perfil
  fotoSection: {
    marginBottom: spacing[4],
    backgroundColor: colors.bgAlt,
    borderRadius: radii.lg,
    padding: spacing[4],
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  fotoRow: {
    alignItems: 'center',
  },
  fotoPreview: {
    width: 100,
    height: 100,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    marginBottom: spacing[3],
    borderWidth: 3,
    borderColor: colors.primary + '40',
  },
  fotoPreviewPlaceholder: {
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotoPreviewIniciais: {
    ...type.h2,
    color: colors.primary,
    fontWeight: '800',
  },
  fotoActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing[2],
  },
  fotoBtn: {
    paddingVertical: 9,
    paddingHorizontal: spacing[4],
    borderRadius: radii.md,
    backgroundColor: colors.accent,
    ...shadows.xs,
  },
  fotoBtnText: {
    ...type.label,
    color: '#fff',
    textTransform: 'none',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
  },
  fotoBtnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  fotoBtnMutedText: {
    ...type.label,
    color: colors.textSecondary,
    textTransform: 'none',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },

  // Badge de permissão
  permissaoBox: {
    marginBottom: spacing[4],
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
  },
  permissaoLabel: {
    ...type.label,
    color: colors.primary,
  },
  permissaoValue: {
    ...type.h4,
    color: colors.primary,
    textTransform: 'capitalize',
  },

  hint: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
    lineHeight: 17,
    fontWeight: '400',
  },

  errorRoot: {
    ...type.caption,
    color: colors.error,
    backgroundColor: colors.errorBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    marginBottom: spacing[3],
    textAlign: 'center',
    fontWeight: '600',
    overflow: 'hidden',
  },
  btnWrap: {
    marginTop: spacing[3],
  },

  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[5],
    opacity: 0.5,
  },
});
