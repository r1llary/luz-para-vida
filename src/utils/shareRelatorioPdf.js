import { Platform, Alert } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

/**
 * Gera PDF a partir de HTML e abre o menu de partilha (ou visualização na web).
 */
export async function shareRelatorioPdf(html) {
  try {
    const { uri } = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Relatório PDF',
      });
    } else if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(uri, '_blank', 'noopener,noreferrer');
    } else {
      Alert.alert(
        'PDF gerado',
        'Não foi possível abrir o menu de partilha neste dispositivo.',
      );
    }
  } catch (e) {
    Alert.alert(
      'Erro',
      e?.message || 'Não foi possível gerar o PDF.',
    );
    throw e;
  }
}
