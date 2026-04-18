import { StyleSheet } from 'react-native';

export const BG = '#CDAA6D';
export const HEADER_BG = '#B89550';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: HEADER_BG,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  menuBtn: {
    padding: 10,
    marginLeft: -6,
  },
  menuBar: {
    width: 22,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  menuBarLast: {
    marginBottom: 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 0.3,
    paddingHorizontal: 8,
  },
  headerLogo: {
    width: 44,
    height: 36,
    marginRight: -4,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 12,
  },
  intro: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.88)',
    marginBottom: 14,
    lineHeight: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  nome: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginRight: 12,
  },
  meta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 4,
  },
  chevron: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
  },
  empty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 16,
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    textAlign: 'center',
    marginTop: 28,
  },
});
