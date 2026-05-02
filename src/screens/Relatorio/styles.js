import { StyleSheet } from 'react-native';

export const BG = '#CDAA6D';

export const styles = StyleSheet.create({
  scrollOuter: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  wrap: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: BG,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 18,
  },
  rowInputs: {
    flexDirection: 'row',
    marginBottom: 16,
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
  cardResumo: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  resumoTitulo: {
    fontSize: 13,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  resumoLinha: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 6,
  },
  resumoNum: {
    fontWeight: '800',
    color: '#fff',
  },
  secReunioes: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    letterSpacing: 0.3,
  },
  reuniaoRow: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.22)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
    marginBottom: 8,
  },
  reuniaoData: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  reuniaoTema: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontStyle: 'italic',
  },
  empty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    paddingVertical: 12,
  },
  error: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  chartSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginBottom: 8,
  },
  chartStats: {
    marginTop: 8,
  },
  chartStatLine: {
    fontSize: 13,
    lineHeight: 20,
    color: '#fff',
    marginBottom: 4,
  },
  chartStatLabel: {
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },
  chartStatValue: {
    fontWeight: '800',
    color: '#fff',
  },
  pdfBtn: {
    backgroundColor: '#F28537',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  pdfBtnDisabled: {
    opacity: 0.5,
  },
  pdfBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  grupoBlock: {
    marginBottom: 18,
  },
  grupoTitulo: {
    fontSize: 14,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
  },
});
