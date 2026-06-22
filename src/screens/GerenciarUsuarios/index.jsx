import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { styles, ROLE_COLORS } from './styles';
import { useGerenciarUsuariosScreen } from './useGerenciarUsuariosScreen';

const ROLES = ['membro', 'lider', 'admin'];
const ROLE_LABEL = { membro: 'Membro', lider: 'Líder', admin: 'Admin' };

function initials(name = '') {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
}

export default function GerenciarUsuarios() {
  const { usuarios, loading, updatingId, currentUserId, alterarPermissao, carregar } =
    useGerenciarUsuariosScreen();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={carregar} />}
      >
        <View style={styles.headerCard}>
          <Text style={styles.headerTitle}>Usuários</Text>
          <Text style={styles.headerSub}>
            Toque em um perfil para alterar a permissão do usuário.
          </Text>
        </View>

        {loading && usuarios.length === 0 ? (
          <ActivityIndicator color="#1A3A6B" style={{ marginTop: 40 }} />
        ) : usuarios.length === 0 ? (
          <Text style={styles.empty}>Nenhum usuário encontrado.</Text>
        ) : (
          usuarios.map((u) => {
            const isSelf = u.id === currentUserId;
            const isUpdating = updatingId === u.id;
            const permissao = u.permissao ?? 'membro';

            return (
              <View key={u.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, isSelf && styles.avatarSelf]}>
                    <Text style={[styles.avatarText, isSelf && styles.avatarTextSelf]}>
                      {initials(u.nomeCompleto)}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {u.nomeCompleto || '—'}
                    </Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                      {u.email || '—'}
                    </Text>
                    {isSelf ? <Text style={styles.selfBadge}>VOCÊ</Text> : null}
                  </View>
                  {isUpdating ? <ActivityIndicator size="small" color="#1A3A6B" /> : null}
                </View>

                <View style={styles.roleRow}>
                  {ROLES.map((role) => {
                    const c = ROLE_COLORS[role];
                    const ativo = permissao === role;
                    return (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleBtn,
                          { borderColor: c.border, backgroundColor: ativo ? c.activeBg : c.bg },
                        ]}
                        onPress={() => !isSelf && !isUpdating && alterarPermissao(u.id, role)}
                        activeOpacity={isSelf ? 1 : 0.75}
                        disabled={isSelf || isUpdating}
                      >
                        <Text
                          style={[
                            styles.roleBtnText,
                            { color: ativo ? c.activeText : c.text },
                          ]}
                        >
                          {ROLE_LABEL[role]}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
