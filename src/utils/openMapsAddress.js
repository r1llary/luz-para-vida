import { Linking, Alert } from 'react-native';

/**
 * Abre o Google Maps (ou app de mapas padrão) com busca pelo endereço.
 */
export async function openMapsAddress(address) {
  const q = (address || '').trim();
  if (!q) {
    Alert.alert(
      'Endereço indisponível',
      'Esta célula não possui endereço cadastrado.',
    );
    return;
  }
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Mapas', 'Não foi possível abrir o aplicativo de mapas.');
    }
  } catch {
    Alert.alert('Mapas', 'Não foi possível abrir o aplicativo de mapas.');
  }
}
