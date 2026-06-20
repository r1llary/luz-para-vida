import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primaryDark,
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
    paddingTop: spacing[5],
    paddingBottom: spacing[8],
  },

  bgCircle1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(201,162,39,0.06)',
    top: -60,
    right: -50,
  },
  bgCircle2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 60,
    left: -40,
  },

  inner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing[6],
  },
  logoSpacer: {
    marginBottom: 0,
  },
  tagline: {
    ...type.caption,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginTop: spacing[2],
    textTransform: 'uppercase',
  },

  // Card branco
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[5],
    ...shadows.lg,
  },
  cardTitle: {
    ...type.h3,
    color: colors.text,
    marginBottom: 4,
  },
  cardSubtitle: {
    ...type.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing[4],
  },

  // Seletor de perfil (dentro do card)
  roleSectionLabel: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[2],
  },
  roleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: spacing[4],
  },
  roleBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.bgAlt,
  },
  roleBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  roleBtnLabel: {
    ...type.h4,
    color: colors.textMuted,
  },
  roleBtnLabelActive: {
    color: colors.primary,
  },
  roleBtnDesc: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '400',
  },
  roleBtnDescActive: {
    color: colors.textSecondary,
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

  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: spacing[5],
    paddingHorizontal: 4,
  },
  linkText: {
    ...type.body,
    color: 'rgba(255,255,255,0.6)',
  },
  linkBold: {
    ...type.body,
    fontWeight: '800',
    color: colors.accentAlt,
    letterSpacing: 0.5,
  },

  footer: {
    ...type.caption,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginTop: spacing[6],
    paddingHorizontal: spacing[4],
    alignSelf: 'center',
    width: '100%',
    maxWidth: 440,
  },
});
