import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { useCelulas } from '../../contexts/CelulasContext';

export function useMinhasCelulasScreen() {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  const { celulas } = useCelulas();

  const handleCadastrar = useCallback(() => {
    navigation.navigate('RegistroCelula');
  }, [navigation]);

  const confirmSignOut = useCallback(() => {
    Alert.alert('Sair', 'Deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', onPress: signOut },
    ]);
  }, [signOut]);

  const openDetalheCelula = useCallback(
    (celula) => {
      navigation.navigate('DetalheCelula', { celula });
    },
    [navigation],
  );

  return {
    user,
    celulas,
    handleCadastrar,
    confirmSignOut,
    openDetalheCelula,
  };
}
