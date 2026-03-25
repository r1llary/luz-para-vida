import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f8fafc',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 24,
  },
  errorRoot: {
    color: '#c53030',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  link: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  linkText: { fontSize: 14, color: '#64748b' },
  linkBold: { fontSize: 14, fontWeight: '700', color: '#2563eb' },
  fotoSection: {
    marginBottom: 16,
  },
  fotoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fotoHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  fotoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    backgroundColor: '#e2e8f0',
    marginBottom: 12,
  },
  fotoActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  fotoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
    marginHorizontal: 6,
    marginBottom: 8,
  },
  fotoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
  },
  fotoBtnOutline: {
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
  },
  fotoRemoveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  permissaoHint: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});
