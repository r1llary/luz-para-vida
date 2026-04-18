import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  containerAuth: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#c53030',
  },
  inputAuth: {
    borderWidth: 0,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1e293b',
  },
  inputAuthError: {
    borderWidth: 2,
    borderColor: '#c53030',
  },
  error: {
    fontSize: 12,
    color: '#c53030',
    marginTop: 4,
  },
  errorAuth: {
    fontSize: 12,
    color: '#7f1d1d',
    marginTop: 4,
    fontWeight: '600',
  },
});
