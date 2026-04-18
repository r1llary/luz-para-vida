import { StyleSheet } from 'react-native';

export const BG = '#CDAA6D';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
    paddingTop: 12,
  },
  celulaNome: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 6,
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  label: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  value: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 22,
  },
  presencaList: {
    marginTop: 4,
  },
  presencaItem: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 24,
  },
  empty: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginTop: 40,
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginTop: 28,
  },
});
