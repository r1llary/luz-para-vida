import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useDetalheCelulaScreen } from './useDetalheCelulaScreen';

const LOGO_HEADER = require('../../../assets/logo.png');

function ScreenHeader({ title, onOpenMenu }) {
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
        {title}
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

function HeroPlaceholder() {
  return (
    <View style={styles.placeholderInner}>
      <View style={styles.placeholderRow}>
        <View style={styles.placeholderSun} />
        <View style={styles.placeholderMountain} />
      </View>
    </View>
  );
}

export default function DetalheCelula() {
  const {
    celula,
    membros,
    reunioes,
    formatDateBr,
    openRelatorio,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    openMenu,
  } = useDetalheCelulaScreen();

  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  if (!celula) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <StatusBar style="light" />
        <View style={styles.errorWrap}>
          <Text style={styles.error}>Célula não encontrada.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const metaLinha =
    celula.dia && celula.horario
      ? `${celula.dia} ${celula.horario}`
      : [celula.dia, celula.horario].filter(Boolean).join(' ');

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScreenHeader
        title={celula.nomeCelula || 'Célula'}
        onOpenMenu={openMenu}
      />

      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.heroWrap}>
          {celula.imagemUrl ? (
            <Image
              source={{ uri: String(celula.imagemUrl) }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          ) : (
            <HeroPlaceholder />
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoNome} numberOfLines={2}>
            {celula.nomeCelula}
          </Text>
          <Text style={styles.infoMeta} numberOfLines={2}>
            {metaLinha}
          </Text>
        </View>

        {celula.local ? (
          <Text style={styles.local}>Local: {celula.local}</Text>
        ) : null}

        <Text style={styles.sectionTitle}>Membros</Text>
        <View style={styles.divider} />

        {membros.length === 0 ? (
          <Text style={styles.empty}>Nenhum membro cadastrado.</Text>
        ) : (
          membros.map((m) => (
            <View key={m.id} style={styles.membroRow}>
              <Text style={styles.membroNome}>{m.nomeCompleto}</Text>
              {m.email ? (
                <Text style={styles.membroEmail}>{m.email}</Text>
              ) : null}
            </View>
          ))
        )}

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitleInline}>Reuniões</Text>
          <TouchableOpacity
            onPress={openNovaReuniao}
            accessibilityRole="button"
            accessibilityLabel="Registrar nova reunião"
          >
            <Text style={styles.sectionLink}>Nova reunião</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {reunioes.length === 0 ? (
          <Text style={styles.empty}>Nenhuma reunião registrada.</Text>
        ) : (
          reunioes.map((r) => (
            <TouchableOpacity
              key={r.id}
              style={styles.reuniaoRow}
              onPress={() => openDetalheReuniao(r)}
              activeOpacity={0.85}
            >
              <Text style={styles.reuniaoData}>
                {formatDateBr(r.dataReuniao) || r.dataReuniao}
              </Text>
              <Text style={styles.reuniaoTema} numberOfLines={2}>
                {r.temaMinistrado || '—'}
              </Text>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.footer}>Powered by Camila Guimaraes</Text>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: bottomPad }]}>
        <View style={styles.relatorioBtnWrap}>
          <Button
            variant="accent"
            title="RELATÓRIO MENSAL"
            onPress={openRelatorio}
          />
        </View>
        <TouchableOpacity
          style={styles.fab}
          onPress={openRegistroMembro}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Cadastrar membro"
        >
          <Text style={styles.fabPlus}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
