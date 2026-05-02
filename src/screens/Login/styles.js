import { StyleSheet } from 'react-native';

export const BG = '#CDAA6D';

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  kav: {
    flex: 1,
    width: '100%',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 28,
  },
  inner: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  logoSpacer: {
    marginBottom: 28,
  },
  fieldBlock: {
    marginBottom: 8,
  },
  errorRoot: {
    color: '#7f1d1d',
    fontSize: 14,
    marginBottom: 14,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.35)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    overflow: 'hidden',
  },
  btnWrap: {
    marginTop: 8,
    width: '100%',
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 24,
    paddingHorizontal: 4,
  },
  linkText: { fontSize: 15, color: 'rgba(255,255,255,0.95)' },
  linkBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
});
