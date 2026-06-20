import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

const ROLE_COLORS = {
  membro:  { bg: '#64748B22', border: '#64748B55', text: '#64748B', activeBg: '#64748B', activeText: '#fff' },
  lider:   { bg: colors.accent + '22', border: colors.accent + '55', text: colors.accent, activeBg: colors.accent, activeText: '#fff' },
  admin:   { bg: '#7C3AED22', border: '#7C3AED55', text: '#7C3AED', activeBg: '#7C3AED', activeText: '#fff' },
};

export { ROLE_COLORS };

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
    paddingTop: spacing[4],
  },

  headerCard: {
    backgroundColor: colors.primary,
    borderRadius: radii.xl,
    padding: spacing[5],
    marginBottom: spacing[4],
    ...shadows.md,
  },
  headerTitle: { ...type.h2, color: '#fff' },
  headerSub: { ...type.caption, color: 'rgba(255,255,255,0.55)', marginTop: 4 },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing[3], marginBottom: spacing[3] },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: radii.full,
    backgroundColor: colors.primary + '20',
    borderWidth: 1.5,
    borderColor: colors.primary + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSelf: { borderColor: colors.accent + '60', backgroundColor: colors.accent + '18' },
  avatarText: { ...type.h4, color: colors.primary, fontSize: 15 },
  avatarTextSelf: { color: colors.accent },

  userInfo: { flex: 1 },
  userName: { ...type.body, fontWeight: '700', color: colors.text },
  userEmail: { ...type.caption, color: colors.textMuted, marginTop: 1 },
  selfBadge: {
    ...type.caption,
    fontSize: 9,
    color: colors.accent,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginTop: 2,
  },

  roleRow: { flexDirection: 'row', gap: 6 },
  roleBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  roleBtnText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  empty: {
    ...type.body,
    color: colors.textMuted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: spacing[10],
  },
  footer: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing[5],
    opacity: 0.5,
  },
});
