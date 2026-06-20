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

  // ── Skeleton loading ─────────────────────────────────────
  skeletonGrid: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  skeletonCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  skeletonImage: {
    height: 130,
    backgroundColor: colors.bgAlt,
  },
  skeletonBody: {
    padding: spacing[3],
    gap: spacing[2],
  },
  skeletonLine: {
    height: 11,
    borderRadius: radii.xs,
    backgroundColor: colors.bgAlt,
  },

  // ── Lista ────────────────────────────────────────────────
  listFlex: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    paddingBottom: spacing[10],
  },
  columnWrap: {
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  scrollFlex: { flex: 1 },

  // ── Card ─────────────────────────────────────────────────
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardImageWrap: {
    height: 130,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },

  // Placeholder da imagem do card
  placeholderInner: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -30,
    right: -20,
  },
  placeholderCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -20,
    left: -10,
  },
  placeholderIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  placeholderRoof: {
    width: 38,
    height: 18,
    borderRadius: 3,
    backgroundColor: colors.accent + 'BB',
  },
  placeholderBody: {
    width: 34,
    height: 24,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  cardBody: {
    padding: spacing[3],
  },
  cardNome: {
    ...type.h4,
    color: colors.text,
    marginBottom: 5,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  cardMetaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.textMuted,
    marginHorizontal: 2,
  },
  cardMetaText: {
    ...type.bodySm,
    color: colors.textSecondary,
  },
  cardAccentBar: {
    height: 3,
    backgroundColor: colors.accent,
  },

  // ── Empty state ──────────────────────────────────────────
  emptyScrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[12],
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[5],
  },
  emptyIconInner: {
    width: 36,
    height: 36,
    borderRadius: radii.md,
    backgroundColor: colors.primary + '33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconBar: {
    width: 18,
    height: 3,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginVertical: 2,
  },
  emptyTitle: {
    ...type.h2,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  emptyText: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 23,
  },

  // ── FAB ──────────────────────────────────────────────────
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabPlus: {
    fontSize: 30,
    fontWeight: '300',
    color: '#fff',
    lineHeight: 34,
    marginTop: -2,
  },

  // ── Misc ─────────────────────────────────────────────────
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing[5],
    opacity: 0.55,
  },
  mockHint: {
    ...type.caption,
    color: colors.warning,
    backgroundColor: colors.warningBg,
    paddingVertical: 4,
    textAlign: 'center',
  },
});
