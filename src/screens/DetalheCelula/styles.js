import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  error: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 24,
  },
  header: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  nome: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  diaHorario: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  local: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  empty: {
    fontSize: 14,
    color: '#94a3b8',
  },
  membroCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  membroNome: {
    fontSize: 16,
    fontWeight: '500',
    color: '#334155',
  },
  membroEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 16,
  },
});
