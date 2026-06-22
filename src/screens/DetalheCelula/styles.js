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

  // ── Scroll ───────────────────────────────────────────────
  scrollFlex: { flex: 1 },
  scroll: {
    paddingBottom: 110,
  },

  // ── Hero ────────────────────────────────────────────────
  heroWrap: {
    marginHorizontal: spacing[4],
    marginTop: spacing[4],
    borderRadius: radii.xl,
    overflow: 'hidden',
    height: 200,
    backgroundColor: colors.primary,
    ...shadows.md,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholderCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.04)',
    top: -60,
    right: -40,
  },
  heroPlaceholderCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -40,
    left: -20,
  },
  heroPlaceholderRoof: {
    width: 56,
    height: 26,
    borderRadius: 4,
    backgroundColor: colors.accent + 'BB',
  },
  heroPlaceholderBody: {
    width: 48,
    height: 34,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginTop: 3,
  },
  heroAccentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.accent,
  },

  // ── Info card ────────────────────────────────────────────
  infoCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[4],
    ...shadows.sm,
  },
  infoNomeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing[2],
  },
  infoNome: {
    ...type.h2,
    color: colors.text,
  },
  liderNome: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing[2],
  },
  editarLink: {
    ...type.label,
    color: colors.accent,
    fontWeight: '700',
    marginTop: 4,
    marginLeft: spacing[2],
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flexWrap: 'wrap',
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  infoChipText: {
    ...type.label,
    color: colors.primary,
    fontWeight: '600',
  },
  infoChipMap: {
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent + '44',
  },
  infoChipMapPin: {
    fontSize: 12,
  },

  // ── Section ──────────────────────────────────────────────
  sectionCard: {
    marginHorizontal: spacing[4],
    marginTop: spacing[3],
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    overflow: 'hidden',
    ...shadows.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  sectionTitle: {
    ...type.label,
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  sectionLink: {
    ...type.label,
    color: colors.accent,
    fontWeight: '700',
  },
  sectionHint: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 1,
    opacity: 0.7,
  },
  sectionEmpty: {
    ...type.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },

  // ── Membros ──────────────────────────────────────────────
  membroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  membroAvatar: {
    width: 38,
    height: 38,
    borderRadius: radii.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  membroAvatarText: {
    ...type.label,
    color: colors.primary,
    fontWeight: '700',
  },
  membroInfo: { flex: 1, minWidth: 0 },
  membroNome: {
    ...type.body,
    color: colors.text,
    fontWeight: '600',
  },
  membroEmail: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 2,
  },

  // ── Reuniões ─────────────────────────────────────────────
  reuniaoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  reuniaoDateBadge: {
    width: 46,
    height: 46,
    borderRadius: radii.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reuniaoDateDay: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 18,
  },
  reuniaoDateMonth: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  reuniaoInfo: { flex: 1 },
  reuniaoData: {
    ...type.body,
    color: colors.text,
    fontWeight: '600',
  },
  reuniaoTema: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  reuniaoStats: {
    ...type.caption,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 4,
  },
  reuniaoChevron: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.4,
  },

  // ── Footer ───────────────────────────────────────────────
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing[5],
    opacity: 0.5,
  },

  // ── Bottom bar ───────────────────────────────────────────
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.sm,
  },
  relatorioBtnWrap: {
    flex: 1,
    marginRight: spacing[3],
  },
  fab: {
    width: 52,
    height: 52,
    borderRadius: radii.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  fabPlus: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '300',
    lineHeight: 34,
    marginTop: -2,
  },

  // ── Error ────────────────────────────────────────────────
  errorWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[8],
  },
  error: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
