import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useMinhasCelulasScreen } from './useMinhasCelulasScreen';

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
        Minhas Células
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

function ImagePlaceholder() {
  return (
    <View style={styles.placeholderInner}>
      <View style={styles.placeholderRow}>
        <View style={styles.placeholderSun} />
        <View style={styles.placeholderMountain} />
      </View>
    </View>
  );
}

export default function MinhasCelulas() {
  const {
    celulas,
    canManage,
    usandoMockLista,
    handleCadastrar,
    openDrawer,
    openDetalheCelula,
  } = useMinhasCelulasScreen();

  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const PAD = 16;
  const GAP = 12;
  const cardWidth = (width - PAD * 2 - GAP) / 2;

  const fabBottom = 20 + Math.max(insets.bottom, 8);

  const renderCelula = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[styles.card, { width: cardWidth }]}
        onPress={() => openDetalheCelula(item)}
        activeOpacity={0.9}
      >
        <View style={styles.cardImageWrap}>
          {item.imagemUrl ? (
            <Image
              source={{ uri: item.imagemUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardNome} numberOfLines={2}>
            {item.nomeCelula}
          </Text>
          <Text style={styles.cardDia} numberOfLines={2}>
            {item.dia}
          </Text>
          <Text style={styles.cardHorario} numberOfLines={1}>
            {item.horario}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [cardWidth, openDetalheCelula],
  );

  const ListFooter = useCallback(
    () => (
      <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
    ),
    [],
  );

  const renderFab = () => (
    <TouchableOpacity
      style={[styles.fab, { right: 20, bottom: fabBottom }]}
      onPress={handleCadastrar}
      activeOpacity={0.9}
      accessibilityRole="button"
      accessibilityLabel="Cadastrar nova célula"
    >
      <Text style={styles.fabPlus}>+</Text>
    </TouchableOpacity>
  );

  if (celulas.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <ScreenHeader onOpenMenu={openDrawer} />
        <ScrollView
          style={styles.scrollFlex}
          contentContainerStyle={styles.emptyScrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.emptyTitle}>Nenhuma célula cadastrada</Text>
          {canManage ? (
            <Text style={styles.emptyText}>
              Use o botão + para registrar sua primeira célula.
            </Text>
          ) : (
            <Text style={styles.emptyText}>
              Você ainda não está vinculado a nenhuma célula. Entre em contato
              com um líder para ser adicionado.
            </Text>
          )}
          <ListFooter />
        </ScrollView>
        {canManage ? renderFab() : null}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScreenHeader onOpenMenu={openDrawer} />
      {__DEV__ && usandoMockLista ? (
        <Text style={[styles.mockHint, { paddingHorizontal: 16, paddingBottom: 6 }]}>
          Lista de teste — mockFlags.js (USE_CELULAS_LIST_MOCK)
        </Text>
      ) : null}
      <FlatList
        style={styles.listFlex}
        data={celulas}
        keyExtractor={(item) => item.id}
        renderItem={renderCelula}
        numColumns={2}
        columnWrapperStyle={styles.columnWrap}
        ListFooterComponent={ListFooter}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
      {canManage ? renderFab() : null}
    </SafeAreaView>
  );
}
