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
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
    paddingBottom: spacing[8],
  },

  // Background circles (decorativos)
  bgCircle1: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(201,162,39,0.07)',
    top: -80,
    right: -60,
  },
  bgCircle2: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.03)',
    bottom: 40,
    left: -50,
  },

  inner: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing[8],
  },
  tagline: {
    ...type.caption,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    letterSpacing: 1.2,
    marginTop: spacing[2],
    textTransform: 'uppercase',
  },

  // Card branco com o formulário
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
    marginBottom: spacing[5],
  },

  fieldBlock: {
    marginBottom: 0,
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

  // Link para cadastro
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
    maxWidth: 400,
  },
});
