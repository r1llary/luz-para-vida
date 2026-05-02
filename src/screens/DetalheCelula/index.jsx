import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
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
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    openEditarCelula,
    openMenu,
    canEditCelula,
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
        contentContainerStyle={[
          styles.scroll,
          !canEditCelula && styles.scrollNoFab,
        ]}
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

        <View style={styles.detailBlock}>
          <Text style={styles.pageTitle} numberOfLines={4}>
            {celula.nomeCelula}
          </Text>
          {celula.local ? (
            <Text style={styles.localLine}>Local: {celula.local}</Text>
          ) : null}
          {celula.endereco ? (
            <Text style={styles.enderecoLine}>
              Endereço: {celula.endereco}
            </Text>
          ) : null}
          {metaLinha ? (
            <Text style={styles.metaLine} numberOfLines={2}>
              {metaLinha}
            </Text>
          ) : null}
        </View>

        <View style={[styles.sectionHeaderRow, styles.sectionHeaderRowFirst]}>
          <Text style={styles.sectionTitleInline}>Membros</Text>
          <TouchableOpacity
            onPress={openRegistroMembro}
            accessibilityRole="button"
            accessibilityLabel="Adicionar membro"
          >
            <Text style={styles.sectionLink}>Adicionar membro</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />

        {membros.length === 0 ? (
          <Text style={styles.empty}>Nenhum membro cadastrado.</Text>
        ) : (
          membros.map((m) => {
            const isLider =
              Boolean(m.userId && celula.liderUserId) &&
              m.userId === celula.liderUserId;
            const isCo =
              Boolean(m.userId && celula.coLiderUserId) &&
              m.userId === celula.coLiderUserId;
            return (
              <View key={m.id} style={styles.membroRow}>
                <View style={styles.membroRowTop}>
                  <Text style={styles.membroNome} numberOfLines={2}>
                    {m.nomeCompleto}
                  </Text>
                  <View style={styles.badgeRow}>
                    {isLider ? (
                      <View style={styles.badgeLider}>
                        <Text style={styles.badgeText}>L</Text>
                      </View>
                    ) : null}
                    {isCo ? (
                      <View style={styles.badgeCo}>
                        <Text style={styles.badgeTextCo}>CL</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                {m.email ? (
                  <Text style={styles.membroEmail}>{m.email}</Text>
                ) : null}
              </View>
            );
          })
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
                {formatDateBr(r.dataReuniao || r.data) ||
                  r.dataReuniao ||
                  r.data ||
                  '—'}
              </Text>
              <Text style={styles.reuniaoTema} numberOfLines={2}>
                {r.temaMinistrado || '—'}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {canEditCelula ? (
        <View style={[styles.bottomBar, { paddingBottom: bottomPad }]}>
          <TouchableOpacity
            style={styles.fab}
            onPress={openEditarCelula}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel="Editar célula"
          >
            <Ionicons name="create-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
