import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button } from '../../components/Buttons';
import { styles } from './styles';
import { useDetalheCelulaScreen } from './useDetalheCelulaScreen';

const LOGO_HEADER = require('../../../assets/logo.png');

const MESES_ABREV = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];

function initials(name = '') {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
}

function parseDateBadge(raw) {
  if (!raw) return null;
  const parts = String(raw).split(/[-/]/);
  if (parts.length === 3) {
    const [y, m, d] = parts.length === 3 && parts[0].length === 4
      ? [Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])]
      : [Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])];
    if (!isNaN(d) && !isNaN(m)) return { day: String(d).padStart(2, '0'), month: MESES_ABREV[m] || '' };
  }
  return null;
}

function ScreenHeader({ title, onOpenMenu }) {
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

function openMaps(address) {
  if (!address) return;
  Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
}

function HeroPlaceholder() {
  return (
    <View style={styles.heroPlaceholder}>
      <View style={styles.heroPlaceholderCircle1} />
      <View style={styles.heroPlaceholderCircle2} />
      <View style={styles.heroPlaceholderRoof} />
      <View style={styles.heroPlaceholderBody} />
      <View style={styles.heroAccentBar} />
    </View>
  );
}

export default function DetalheCelula() {
  const {
    celula,
    liderNome,
    membros,
    reunioes,
    canManage,
    formatDateBr,
    openRelatorio,
    openEditarCelula,
    openMembrosCelula,
    openNovaReuniao,
    openDetalheReuniao,
    openRegistroMembro,
    confirmarRemoverMembro,
    openMenu,
  } = useDetalheCelulaScreen();

  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, 12);

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

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <ScreenHeader title={celula.nomeCelula || 'Célula'} onOpenMenu={openMenu} />

      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* ── Hero ── */}
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
          <View style={styles.heroAccentBar} />
        </View>

        {/* ── Info card ── */}
        <View style={styles.infoCard}>
          <View style={styles.infoNomeRow}>
            <Text style={[styles.infoNome, { flex: 1 }]} numberOfLines={2}>
              {celula.nomeCelula}
            </Text>
            {canManage ? (
              <TouchableOpacity
                onPress={openEditarCelula}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Editar célula"
              >
                <Text style={styles.editarLink}>Editar</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {liderNome ? (
            <Text style={styles.liderNome}>Líder: {liderNome}</Text>
          ) : null}

          <View style={styles.infoMetaRow}>
            {celula.dia ? (
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>{celula.dia}</Text>
              </View>
            ) : null}
            {celula.horario ? (
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>{celula.horario}</Text>
              </View>
            ) : null}
            {celula.local ? (
              <TouchableOpacity
                style={[styles.infoChip, styles.infoChipMap]}
                onPress={() => openMaps(celula.local)}
                activeOpacity={0.75}
                accessibilityRole="link"
                accessibilityLabel={`Abrir no Maps: ${celula.local}`}
              >
                <Text style={styles.infoChipMapPin}>📍</Text>
                <Text style={styles.infoChipText} numberOfLines={1}>{celula.local}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* ── Membros ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Membros ({membros.length})</Text>
              {canManage && membros.length > 0 ? (
                <Text style={styles.sectionHint}>Segure para remover</Text>
              ) : null}
            </View>
            <TouchableOpacity onPress={openMembrosCelula} accessibilityRole="button">
              <Text style={styles.sectionLink}>Ver contatos</Text>
            </TouchableOpacity>
          </View>
          {membros.length === 0 ? (
            <Text style={styles.sectionEmpty}>
              {canManage
                ? 'Nenhum membro cadastrado. Toque no botão + abaixo para adicionar.'
                : 'Nenhum membro cadastrado.'}
            </Text>
          ) : (
            membros.map((m, idx) => (
              <TouchableOpacity
                key={m.id}
                style={[
                  styles.membroRow,
                  idx === membros.length - 1 && { borderBottomWidth: 0 },
                ]}
                onLongPress={canManage ? () => confirmarRemoverMembro(m) : undefined}
                delayLongPress={400}
                activeOpacity={canManage ? 0.7 : 1}
                accessibilityRole={canManage ? 'button' : 'none'}
                accessibilityLabel={canManage ? `${m.nomeCompleto} — segure para remover` : m.nomeCompleto}
              >
                <View style={styles.membroAvatar}>
                  <Text style={styles.membroAvatarText}>{initials(m.nomeCompleto)}</Text>
                </View>
                <View style={styles.membroInfo}>
                  <Text style={styles.membroNome}>{m.nomeCompleto}</Text>
                  {m.email ? (
                    <Text style={styles.membroEmail}>{m.email}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* ── Reuniões ── */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Reuniões</Text>
            {canManage ? (
              <TouchableOpacity
                onPress={openNovaReuniao}
                accessibilityRole="button"
                accessibilityLabel="Registrar nova reunião"
              >
                <Text style={styles.sectionLink}>+ Nova reunião</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {reunioes.length === 0 ? (
            <Text style={styles.sectionEmpty}>Nenhuma reunião registrada.</Text>
          ) : (
            reunioes.map((r, idx) => {
              const badge = parseDateBadge(r.dataReuniao);
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.reuniaoRow,
                    idx === reunioes.length - 1 && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => openDetalheReuniao(r)}
                  activeOpacity={0.85}
                >
                  <View style={styles.reuniaoDateBadge}>
                    {badge ? (
                      <>
                        <Text style={styles.reuniaoDateDay}>{badge.day}</Text>
                        <Text style={styles.reuniaoDateMonth}>{badge.month}</Text>
                      </>
                    ) : (
                      <Text style={styles.reuniaoDateDay}>—</Text>
                    )}
                  </View>
                  <View style={styles.reuniaoInfo}>
                    <Text style={styles.reuniaoData}>
                      {formatDateBr(r.dataReuniao) || r.dataReuniao || 'Sem data'}
                    </Text>
                    <Text style={styles.reuniaoTema} numberOfLines={2}>
                      {r.temaMinistrado || 'Sem tema registrado'}
                    </Text>
                    <Text style={styles.reuniaoStats}>
                      {r.membrosPresentes ?? 0} presentes
                      {(r.visitantes ?? 0) > 0 ? ` · ${r.visitantes} visitantes` : ''}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>
      </ScrollView>

      {/* ── Bottom bar (só lider/admin) ── */}
      {canManage ? (
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
            activeOpacity={0.88}
            accessibilityRole="button"
            accessibilityLabel="Cadastrar membro"
          >
            <Text style={styles.fabPlus}>+</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </SafeAreaView>
  );
}
