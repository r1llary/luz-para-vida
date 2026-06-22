import { StyleSheet } from 'react-native';
import { colors, radii, shadows, spacing, type } from '../../theme';

export const styles = StyleSheet.create({
  scrollOuter: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    padding: spacing[4],
    paddingBottom: spacing[10],
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing[6],
    backgroundColor: colors.bg,
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

  title: {
    ...type.h3,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...type.body,
    fontWeight: '600',
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  hint: {
    ...type.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing[4],
    lineHeight: 17,
    fontWeight: '400',
  },

  rowInputs: {
    flexDirection: 'row',
    marginBottom: spacing[4],
  },
  inputHalf: {
    flex: 1,
    minWidth: 0,
  },
  inputHalfLeft: {
    marginRight: 6,
  },
  inputHalfRight: {
    marginLeft: 6,
  },

  // Card de resumo
  cardResumo: {
    backgroundColor: colors.primaryLight,
    borderRadius: radii.lg,
    padding: spacing[4],
    marginBottom: spacing[4],
    borderWidth: 1,
    borderColor: colors.border,
  },
  resumoTitulo: {
    ...type.label,
    color: colors.primary,
    marginBottom: spacing[3],
  },
  resumoLinha: {
    ...type.body,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  resumoNum: {
    fontWeight: '800',
    color: colors.primary,
  },

  secReunioes: {
    ...type.h4,
    color: colors.text,
    marginBottom: spacing[3],
  },
  reuniaoRow: {
    paddingVertical: 13,
    paddingHorizontal: spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    backgroundColor: colors.bgAlt,
    borderRadius: radii.md,
    marginBottom: spacing[2],
  },
  reuniaoData: {
    ...type.body,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 3,
  },
  reuniaoTema: {
    ...type.caption,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },

  secFreq: {
    ...type.h4,
    color: colors.text,
    marginTop: spacing[5],
    marginBottom: spacing[3],
  },
  freqRow: {
    backgroundColor: colors.bgAlt,
    borderRadius: radii.md,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  freqTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  freqNome: {
    ...type.body,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: spacing[2],
  },
  freqPct: {
    ...type.caption,
    fontWeight: '700',
  },
  freqBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.borderLight,
    overflow: 'hidden',
  },
  freqFill: {
    height: 6,
    borderRadius: 3,
  },

  empty: {
    ...type.bodySm,
    color: colors.textMuted,
    fontStyle: 'italic',
    paddingVertical: spacing[3],
  },
  error: {
    ...type.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Period navigator (‹ Junho 2026 ›)
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    ...shadows.sm,
  },
  periodArrow: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[5],
  },
  periodArrowText: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: '700',
    lineHeight: 30,
  },
  periodLabel: {
    flex: 1,
    textAlign: 'center',
    ...type.h4,
    color: colors.text,
    fontWeight: '700',
  },

  // KPI cards
  kpiRow: {
    flexDirection: 'row',
    marginBottom: spacing[3],
  },
  kpiCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing[3],
    alignItems: 'center',
    marginRight: spacing[2],
    ...shadows.sm,
  },
  kpiCardLast: {
    marginRight: 0,
  },
  kpiNum: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 30,
  },
  kpiLabel: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },

  // PDF button
  pdfBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  pdfBtnText: {
    ...type.body,
    color: '#fff',
    fontWeight: '700',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgAlt,
    borderRadius: radii.lg,
    padding: 3,
    marginBottom: spacing[4],
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: radii.md,
  },
  tabActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  tabText: {
    ...type.caption,
    color: colors.textMuted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },

  // Bar chart (visitor evolution)
  chartWrap: {
    backgroundColor: colors.surface,
    borderRadius: radii.xl,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.sm,
  },
  chartTitle: {
    ...type.label,
    color: colors.textMuted,
    marginBottom: spacing[3],
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 110,
    justifyContent: 'space-around',
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: '55%',
    backgroundColor: colors.primary,
    borderRadius: 3,
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 9,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 2,
  },
  chartLabel: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },

  // Visitor list
  visitRow: {
    backgroundColor: colors.bgAlt,
    borderRadius: radii.md,
    padding: spacing[3],
    marginBottom: spacing[2],
  },
  visitNome: {
    ...type.body,
    fontWeight: '600',
    color: colors.text,
  },
  visitContato: {
    ...type.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  visitMeta: {
    ...type.caption,
    color: colors.textMuted,
    marginTop: 1,
    fontStyle: 'italic',
  },
});
