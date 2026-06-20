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

  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[8],
  },
  error: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  searchHint: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
    lineHeight: 18,
  },
  searchBtnWrap: {
    marginTop: spacing[2],
  },
  buscaResultado: {
    marginTop: spacing[3],
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: radii.md,
    backgroundColor: '#D1FAE5',
    borderWidth: 1,
    borderColor: '#6EE7B7',
  },
  buscaResultadoText: {
    ...type.caption,
    color: '#065F46',
    fontWeight: '600',
  },
  buscaResultadoNeutro: {
    backgroundColor: colors.bgAlt,
    borderColor: colors.borderLight,
  },
  buscaResultadoNeutroText: {
    ...type.caption,
    color: colors.textMuted,
  },

  cepCarregando: {
    ...type.caption,
    color: colors.primary,
    fontStyle: 'italic',
    marginBottom: spacing[2],
    marginTop: -4,
  },
});
