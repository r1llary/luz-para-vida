import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
    paddingTop: spacing[1],
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabActive: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tabText: {
    ...type.caption,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },

  // Member card
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing[3],
  },
  avatarVisit: {
    backgroundColor: colors.textMuted,
  },
  avatarText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  nome: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: spacing[3],
  },

  // Info rows
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing[2],
  },
  infoLabel: {
    ...type.caption,
    color: colors.textMuted,
    width: 80,
    flexShrink: 0,
    fontWeight: '600',
  },
  infoValue: {
    ...type.caption,
    color: colors.textSecondary,
    flex: 1,
    flexWrap: 'wrap',
  },

  // Visitor card
  visitCard: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[3],
    marginBottom: spacing[2],
    ...shadows.sm,
  },
  visitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[1],
  },
  visitInfo: {
    flex: 1,
  },
  contato: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  visitData: {
    ...type.caption,
    color: colors.textMuted,
    fontStyle: 'italic',
    marginTop: spacing[1],
  },

  empty: {
    ...type.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing[6],
  },
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[6],
  },
});
