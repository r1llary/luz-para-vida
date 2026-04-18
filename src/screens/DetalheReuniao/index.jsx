import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useDetalheReuniaoScreen } from './useDetalheReuniaoScreen';

export default function DetalheReuniao() {
  const {
    reuniao,
    celulaNome,
    dataLabel,
    nomesPresentes,
    legacyCount,
  } = useDetalheReuniaoScreen();

  if (!reuniao) {
    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <StatusBar style="light" />
        <Text style={styles.empty}>Reunião não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const temPresencaPorNome = nomesPresentes.length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {celulaNome ? (
          <Text style={styles.celulaNome}>{celulaNome}</Text>
        ) : null}
        <Text style={styles.title}>{dataLabel || reuniao.dataReuniao}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Visitantes</Text>
          <Text style={styles.value}>{String(reuniao.visitantes ?? 0)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Membros presentes</Text>
          {temPresencaPorNome ? (
            <View style={styles.presencaList}>
              {nomesPresentes.map((nome, idx) => (
                <Text key={`${nome}-${idx}`} style={styles.presencaItem}>
                  • {nome}
                </Text>
              ))}
            </View>
          ) : (
            <Text style={styles.value}>
              {legacyCount > 0
                ? `${legacyCount} (registro anterior — apenas quantidade)`
                : '—'}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tema ministrado</Text>
          <Text style={styles.value}>{reuniao.temaMinistrado || '—'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Texto base</Text>
          <Text style={styles.value}>{reuniao.textoBase?.trim() || '—'}</Text>
        </View>

        <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
