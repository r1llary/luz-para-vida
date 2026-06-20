import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // ── Header ──────────────────────────────────────────────
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingVertical: 14,
  },
  menuBtn: {
    width: 36,
    height: 36,
    borderRadius: radii.sm,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBar: {
    width: 18,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 2,
    marginVertical: 2,
  },
  menuBarLast: { width: 12 },
  headerTitle: {
    ...type.h3,
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  headerLogo: {
    width: 36,
    height: 36,
  },

  // ── Content ──────────────────────────────────────────────
  scrollFlex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
    paddingTop: spacing[4],
  },
  intro: {
    ...type.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing[4],
    lineHeight: 20,
  },

  // ── List rows ────────────────────────────────────────────
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: spacing[4],
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  rowLeft: { flex: 1, marginRight: spacing[3] },
  nome: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 3,
  },
  chevron: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '600',
  },

  empty: {
    ...type.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing[8],
    paddingHorizontal: spacing[4],
  },
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[6],
    opacity: 0.5,
  },
});
