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
    alignItems: 'stretch',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
  },
  inner: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 22,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  permissaoHint: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.72)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 1,
    paddingHorizontal: 8,
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
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 22,
    paddingHorizontal: 4,
  },
  linkText: { fontSize: 15, color: 'rgba(255,255,255,0.95)' },
  linkBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  btnWrap: {
    marginTop: 12,
    width: '100%',
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 440,
  },
  logoSpacer: {
    marginBottom: 12,
  },
});
