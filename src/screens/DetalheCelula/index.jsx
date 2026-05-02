import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
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
    user,
    formatDateBr,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    openEditarCelula,
    openMenu,
    opcoesLideranca,
    canEditLideranca,
    canEditCelula,
    updateCelulaFields,
  } = useDetalheCelulaScreen();

  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 10);

  const [liderModalOpen, setLiderModalOpen] = useState(false);
  const [draftLider, setDraftLider] = useState('');
  const [draftCo, setDraftCo] = useState('');

  useEffect(() => {
    if (!liderModalOpen || !celula) return;
    setDraftLider(celula.liderUserId || user?.id || '');
    setDraftCo(celula.coLiderUserId || '');
  }, [liderModalOpen, celula, user?.id]);

  const opcoesCoLider = opcoesLideranca.filter((o) => o.id !== draftLider);

  const onSaveLideranca = useCallback(async () => {
    if (!celula?.id) return;
    if (draftCo && draftCo === draftLider) {
      Alert.alert('Validação', 'Co-líder deve ser outra pessoa além do líder.');
      return;
    }
    if (!draftLider) {
      Alert.alert('Validação', 'Selecione o líder da célula.');
      return;
    }
    try {
      await updateCelulaFields(celula.id, {
        liderUserId: draftLider,
        coLiderUserId: draftCo || '',
      });
      setLiderModalOpen(false);
    } catch (e) {
      Alert.alert('Erro', e?.message || 'Não foi possível salvar.');
    }
  }, [celula?.id, draftLider, draftCo, updateCelulaFields]);

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
          <View style={styles.sectionHeaderLinks}>
            {canEditLideranca ? (
              <TouchableOpacity
                onPress={() => setLiderModalOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Alterar líder e co-líder"
              >
                <Text style={styles.sectionLink}>Alterar liderança</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={openRegistroMembro}
              accessibilityRole="button"
              accessibilityLabel="Adicionar membro"
            >
              <Text style={styles.sectionLink}>Adicionar membro</Text>
            </TouchableOpacity>
          </View>
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
                {formatDateBr(r.dataReuniao) || r.dataReuniao}
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

      <Modal
        visible={liderModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setLiderModalOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setLiderModalOpen(false)}
        >
          <Pressable
            style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 16) }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Líder e co-líder</Text>
            <Text style={styles.modalHint}>
              Escolha entre você e os membros que já têm usuário (campo userId).
            </Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>Líder</Text>
              {opcoesLideranca.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.modalOption,
                    draftLider === o.id && styles.modalOptionOn,
                  ]}
                  onPress={() => setDraftLider(o.id)}
                >
                  <Text style={styles.modalOptionText}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionLabel}>Co-líder</Text>
              <TouchableOpacity
                style={[
                  styles.modalOption,
                  !draftCo && styles.modalOptionOn,
                ]}
                onPress={() => setDraftCo('')}
              >
                <Text style={styles.modalOptionText}>Nenhum</Text>
              </TouchableOpacity>
              {opcoesCoLider.map((o) => (
                <TouchableOpacity
                  key={o.id}
                  style={[
                    styles.modalOption,
                    draftCo === o.id && styles.modalOptionOn,
                  ]}
                  onPress={() => setDraftCo(o.id)}
                >
                  <Text style={styles.modalOptionText}>{o.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setLiderModalOpen(false)}
                style={styles.modalBtnPad}
              >
                <Text style={styles.liderancaBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onSaveLideranca}
                style={styles.modalBtnPad}
              >
                <Text style={styles.liderancaBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
