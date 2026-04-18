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
  logoSpacer: {
    marginBottom: 12,
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
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    fontWeight: '500',
    paddingHorizontal: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
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
    marginTop: 12,
    width: '100%',
    marginBottom: 8,
  },
  footer: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 16,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 440,
  },
  errorWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: BG,
  },
  error: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
});
