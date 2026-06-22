import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, radii, spacing, type } from '../theme';

const ROLE_LABEL = { lider: 'Líder', admin: 'Administrador', membro: 'Membro' };
const ROLE_COLOR = { lider: colors.accent, admin: '#7C3AED', membro: '#64748B' };

export function CustomDrawerContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user, signOut, canManage, isAdmin } = useAuth();

  const go = (tab, screen, params) => {
    navigation.closeDrawer();
    navigation.navigate('Principal', { screen: tab, params: screen ? { screen, params } : undefined });
  };

  const initials = (name = '') =>
    name.trim().split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || '?';

  const roleBg = ROLE_COLOR[user?.permissao] ?? '#64748B';

  return (
    <View style={[styles.root, { paddingTop: Math.max(insets.top, 12) }]}>
      {/* ── Cabeçalho do usuário ── */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          {user?.fotoPerfilUrl ? (
            <Image
              source={{ uri: String(user.fotoPerfilUrl) }}
              style={styles.avatarImg}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.avatarText}>{initials(user?.nomeCompleto)}</Text>
          )}
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {user?.nomeCompleto || 'Usuário'}
          </Text>
          <Text style={styles.userEmail} numberOfLines={1}>
            {user?.email || ''}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: roleBg + '22', borderColor: roleBg + '55' }]}>
            <Text style={[styles.roleText, { color: roleBg }]}>
              {ROLE_LABEL[user?.permissao] ?? 'Membro'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Navegação ── */}
      <ScrollView
        style={styles.nav}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <SectionLabel label="Perfil" />
        <NavItem icon="person-outline" label="Meu Perfil" onPress={() => go('PerfilTab', 'EditarPerfil')} />

        <SectionLabel label="Células" />
        <NavItem icon="grid-outline" label="Minhas Células" onPress={() => go('CelulasTab', 'MinhasCelulas')} />
        {canManage && (
          <NavItem icon="add-circle-outline" label="Nova Célula" onPress={() => go('CelulasTab', 'RegistroCelula')} accent />
        )}

        {isAdmin && (
          <>
            <SectionLabel label="Administração" />
            <NavItem icon="people-outline" label="Gerenciar Usuários" onPress={() => go('CelulasTab', 'GerenciarUsuarios')} />
          </>
        )}

        {canManage && (
          <>
            <SectionLabel label="Relatórios" />
            <NavItem icon="analytics-outline" label="Ver Relatórios" onPress={() => go('RelatoriosTab', 'RelatoriosLista')} />
          </>
        )}
      </ScrollView>

      {/* ── Rodapé ── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.signOutBtn} onPress={() => { navigation.closeDrawer(); void signOut(); }} activeOpacity={0.75}>
          <Ionicons name="log-out-outline" size={18} color="#F87171" />
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>
        <Text style={styles.version}>Luz para Vida · v1.0</Text>
      </View>
    </View>
  );
}

function SectionLabel({ label }) {
  return <Text style={styles.sectionLabel}>{label}</Text>;
}

function NavItem({ icon, label, onPress, accent = false }) {
  return (
    <TouchableOpacity style={styles.navItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.navIconWrap, accent && styles.navIconAccent]}>
        <Ionicons
          name={icon}
          size={18}
          color={accent ? colors.accent : colors.drawerMuted}
        />
      </View>
      <Text style={[styles.navLabel, accent && styles.navLabelAccent]}>{label}</Text>
      <Ionicons name="chevron-forward" size={14} color={colors.drawerMuted} style={{ opacity: 0.5 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.drawer,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    gap: spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radii.full,
    backgroundColor: colors.accent + '30',
    borderWidth: 2,
    borderColor: colors.accent + '60',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: radii.full,
  },
  avatarText: {
    ...type.h4,
    color: colors.accent,
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    ...type.h4,
    color: colors.drawerText,
  },
  userEmail: {
    ...type.caption,
    color: colors.drawerMuted,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radii.full,
    borderWidth: 1,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.drawerBorder,
    marginHorizontal: spacing[5],
  },
  nav: {
    flex: 1,
    paddingTop: spacing[3],
  },
  sectionLabel: {
    ...type.label,
    color: colors.drawerMuted,
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[2],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginHorizontal: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: 12,
    borderRadius: radii.md,
    marginBottom: 2,
  },
  navIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radii.sm,
    backgroundColor: colors.drawerSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIconAccent: {
    backgroundColor: colors.accent + '18',
  },
  navLabel: {
    ...type.body,
    color: colors.drawerText,
    flex: 1,
  },
  navLabelAccent: {
    color: colors.accent,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: spacing[3],
    paddingTop: spacing[2],
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: 14,
    borderRadius: radii.md,
    backgroundColor: 'rgba(248, 113, 113, 0.08)',
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  signOutText: {
    ...type.body,
    fontWeight: '600',
    color: '#F87171',
  },
  version: {
    ...type.caption,
    color: colors.drawerMuted,
    textAlign: 'center',
    opacity: 0.5,
    paddingBottom: spacing[2],
  },
});
