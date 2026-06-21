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

  hint: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing[3],
    lineHeight: 17,
    fontWeight: '400',
  },

  presencaLabel: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[2],
  },
  presencaHint: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
    lineHeight: 17,
    fontWeight: '400',
  },
  semMembros: {
    ...type.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing[3],
    lineHeight: 20,
    paddingHorizontal: spacing[2],
  },
  membrosBox: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: colors.bgAlt,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing[2],
  },
  membroLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  membroLinhaAtiva: {
    backgroundColor: colors.primaryLight,
  },
  membroCheck: {
    fontSize: 18,
    color: colors.primary,
    marginRight: spacing[3],
    width: 26,
  },
  membroNome: {
    flex: 1,
    ...type.body,
    fontWeight: '600',
    color: colors.text,
  },

  visitantesLabel: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[2],
  },
  visitantesHint: {
    ...type.caption,
    color: colors.textMuted,
    marginBottom: spacing[3],
    lineHeight: 17,
    fontWeight: '400',
  },
  visitanteVazio: {
    ...type.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: spacing[3],
  },
  visitanteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
    gap: spacing[2],
  },
  visitanteInputs: {
    flex: 1,
  },
  visitanteRemoveBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.errorBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  visitanteRemoveBtnText: {
    fontSize: 14,
    color: colors.error,
    fontWeight: '700',
  },
  visitanteAddBtn: {
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: spacing[1],
  },
  visitanteAddBtnText: {
    ...type.label,
    color: colors.primary,
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
  errorField: {
    ...type.caption,
    color: colors.error,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing[2],
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
