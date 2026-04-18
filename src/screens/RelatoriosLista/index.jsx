import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useRelatoriosListaScreen } from './useRelatoriosListaScreen';

const LOGO_HEADER = require('../../../assets/logo.png');

function ScreenHeader({ onOpenMenu }) {
  return (
    <View style={styles.screenHeader}>
      <TouchableOpacity
        style={styles.menuBtn}
        onPress={onOpenMenu}
        accessibilityRole="button"
        accessibilityLabel="Abrir menu"
      >
        <View>
          <View style={styles.menuBar} />
          <View style={styles.menuBar} />
          <View style={[styles.menuBar, styles.menuBarLast]} />
        </View>
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1}>
        Relatórios
      </Text>
      <Image
        source={LOGO_HEADER}
        style={styles.headerLogo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

export default function RelatoriosLista() {
  const {
    celulas,
    usandoMockLista,
    openDrawer,
    openRelatorio,
  } = useRelatoriosListaScreen();

  const renderRow = useCallback(
    (item) => (
      <TouchableOpacity
        key={item.id}
        style={styles.row}
        onPress={() => openRelatorio(item)}
        activeOpacity={0.85}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.nome} numberOfLines={2}>
            {item.nomeCelula}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {[item.dia, item.horario].filter(Boolean).join(' · ')}
          </Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>
    ),
    [openRelatorio]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <ScreenHeader onOpenMenu={openDrawer} />
      {__DEV__ && usandoMockLista ? (
        <Text style={[styles.intro, { paddingHorizontal: 16, paddingTop: 8 }]}>
          Lista de teste — mockFlags.js
        </Text>
      ) : null}
      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Escolha uma célula para ver o relatório mensal (filtro por mês e ano).
        </Text>
        {celulas.length === 0 ? (
          <Text style={styles.empty}>Nenhuma célula cadastrada.</Text>
        ) : (
          celulas.map((c) => renderRow(c))
        )}
        <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
