import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles } from './styles';
import { useMinhasCelulasScreen } from './useMinhasCelulasScreen';
import { NovaCelulaModal } from '../../components/NovaCelulaModal';
import { openMapsAddress } from '../../utils/openMapsAddress';

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
    handleCadastrar,
    openDrawer,
    openDetalheCelula,
    novaCelulaOpen,
    closeNovaCelula,
    onNovaCelulaCreated,
  } = useMinhasCelulasScreen();

  const insets = useSafeAreaInsets();
  const fabBottom = 20 + Math.max(insets.bottom, 8);

  const renderCelula = useCallback(
    ({ item }) => {
      const meta = [item.dia, item.horario].filter(Boolean).join(' · ');
      return (
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => openDetalheCelula(item)}
            activeOpacity={0.92}
            accessibilityRole="button"
            accessibilityLabel={`Abrir ${item.nomeCelula || 'célula'}`}
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
                {item.nomeCelula || '—'}
              </Text>
              {item.local ? (
                <Text style={styles.cardLocal} numberOfLines={2}>
                  {item.local}
                </Text>
              ) : null}
              <Text style={styles.cardEndereco} numberOfLines={4}>
                {item.endereco?.trim() ? item.endereco : 'Endereço não informado'}
              </Text>
              {meta ? (
                <Text style={styles.cardMeta} numberOfLines={2}>
                  {meta}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mapsBtn}
            onPress={() => openMapsAddress(item.endereco)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Como chegar no mapa"
          >
            <Text style={styles.mapsBtnText}>Como chegar</Text>
          </TouchableOpacity>
        </View>
      );
    },
    [openDetalheCelula],
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
          <Text style={styles.emptyText}>
            Use o botão + para registrar sua primeira célula.
          </Text>
        </ScrollView>
        {renderFab()}
        <NovaCelulaModal
          visible={novaCelulaOpen}
          onClose={closeNovaCelula}
          onCreated={onNovaCelulaCreated}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScreenHeader onOpenMenu={openDrawer} />
      <FlatList
        style={styles.listFlex}
        data={celulas}
        keyExtractor={(item) => item.id}
        renderItem={renderCelula}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
      {renderFab()}
      <NovaCelulaModal
        visible={novaCelulaOpen}
        onClose={closeNovaCelula}
        onCreated={onNovaCelulaCreated}
      />
    </SafeAreaView>
  );
}
