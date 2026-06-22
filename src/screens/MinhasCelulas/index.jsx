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
        <View style={styles.menuBar} />
        <View style={styles.menuBar} />
        <View style={[styles.menuBar, styles.menuBarLast]} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Minhas Células</Text>
      <Image
        source={LOGO_HEADER}
        style={styles.headerLogo}
        resizeMode="contain"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

function CardPlaceholder() {
  return (
    <View style={styles.placeholderInner}>
      <View style={styles.placeholderCircle1} />
      <View style={styles.placeholderCircle2} />
      <View style={styles.placeholderIcon}>
        <View style={styles.placeholderRoof} />
        <View style={styles.placeholderBody} />
      </View>
    </View>
  );
}

function SkeletonCard({ width }) {
  return (
    <View style={[styles.skeletonCard, { width }]}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLine} />
        <View style={[styles.skeletonLine, { width: '65%' }]} />
      </View>
    </View>
  );
}

export default function MinhasCelulas() {
  const {
    celulas,
    canManage,
    loadingCelulas,
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
        activeOpacity={0.88}
      >
        <View style={styles.cardImageWrap}>
          {item.imagemUrl ? (
            <Image
              source={{ uri: item.imagemUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
          ) : (
            <CardPlaceholder />
          )}
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.cardNome} numberOfLines={2}>
            {item.nomeCelula}
          </Text>
          <View style={styles.cardMeta}>
            <Text style={styles.cardMetaText} numberOfLines={1}>
              {[item.dia, item.horario].filter(Boolean).join('  ·  ')}
            </Text>
          </View>
        </View>
        <View style={styles.cardAccentBar} />
      </TouchableOpacity>
    ),
    [cardWidth, openDetalheCelula],
  );

  const ListFooter = useCallback(
    () => <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>,
    [],
  );

  const renderFab = () =>
    canManage ? (
      <TouchableOpacity
        style={[styles.fab, { right: 20, bottom: fabBottom }]}
        onPress={handleCadastrar}
        activeOpacity={0.88}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar nova célula"
      >
        <Text style={styles.fabPlus}>+</Text>
      </TouchableOpacity>
    ) : null;

  if (loadingCelulas) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <ScreenHeader onOpenMenu={openDrawer} />
        <View style={styles.skeletonGrid}>
          <SkeletonCard width={cardWidth} />
          <SkeletonCard width={cardWidth} />
        </View>
      </SafeAreaView>
    );
  }

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
          <View style={styles.emptyIconWrap}>
            <View style={styles.emptyIconInner}>
              <View style={styles.emptyIconBar} />
              <View style={styles.emptyIconBar} />
              <View style={[styles.emptyIconBar, { width: 10 }]} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>
            {canManage ? 'Nenhuma célula ainda' : 'Sem células vinculadas'}
          </Text>
          <Text style={styles.emptyText}>
            {canManage
              ? 'Toque no botão + para registrar sua primeira célula.'
              : 'Você ainda não está vinculado a nenhuma célula. Entre em contato com um líder.'}
          </Text>
          <ListFooter />
        </ScrollView>
        {renderFab()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScreenHeader onOpenMenu={openDrawer} />
      {__DEV__ && usandoMockLista ? (
        <Text style={styles.mockHint}>Lista de teste (USE_CELULAS_LIST_MOCK)</Text>
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
      {renderFab()}
    </SafeAreaView>
  );
}
