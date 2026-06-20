import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
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
  hint: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
    lineHeight: 17,
    fontWeight: '400',
  },

  membroBlock: {
    marginBottom: spacing[3],
  },
  addMembro: {
    ...type.body,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  removeMembro: {
    ...type.caption,
    fontWeight: '700',
    color: colors.error,
    textAlign: 'right',
    marginTop: 4,
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

  imagemWrap: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgAlt,
    marginBottom: spacing[3],
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemPreview: {
    width: '100%',
    height: '100%',
  },
  imagemPlaceholder: {
    alignItems: 'center',
    gap: spacing[2],
  },
  imagemPlaceholderIcon: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemPlaceholderIconText: {
    fontSize: 20,
  },
  imagemPlaceholderText: {
    ...type.caption,
    color: colors.textMuted,
  },
  imagemAcoes: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  imagemBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  imagemBtnRemover: {
    backgroundColor: colors.bgAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imagemBtnText: {
    ...type.label,
    color: '#fff',
  },
  imagemBtnRemoverText: {
    ...type.label,
    color: colors.textMuted,
  },

  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[5],
    opacity: 0.5,
  },
});
