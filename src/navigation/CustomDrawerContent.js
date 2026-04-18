import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

const BG = '#CDAA6D';
const HEADER_BG = '#B89550';

/**
 * Lista todas as rotas nomeadas do app para acesso rápido.
 * Rotas que exigem parâmetros navegam até o fluxo adequado ou à lista inicial.
 */
export function CustomDrawerContent({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  const closeAnd = (fn) => {
    navigation.closeDrawer();
    fn();
  };

  /** Abas ficam dentro da tela `Principal` do Drawer */
  const navToTab = (tabName, stackParams) => {
    navigation.navigate('Principal', {
      screen: tabName,
      params: stackParams,
    });
    navigation.closeDrawer();
  };

  const confirmSignOut = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => void signOut(),
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.scroll, { paddingTop: Math.max(insets.top, 12) }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: Math.max(insets.bottom, 16) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Text style={styles.headerSub}>Luz para Vida</Text>
      </View>

      <Text style={styles.section}>Perfil</Text>
      <DrawerLink
        label="EditarPerfil — Meu perfil"
        onPress={() => navToTab('PerfilTab', { screen: 'EditarPerfil' })}
      />

      <Text style={styles.section}>Células</Text>
      <DrawerLink
        label="MinhasCelulas — Lista"
        onPress={() => navToTab('CelulasTab', { screen: 'MinhasCelulas' })}
      />
      <DrawerLink
        label="RegistroCelula — Nova célula"
        onPress={() => navToTab('CelulasTab', { screen: 'RegistroCelula' })}
      />
      <DrawerLink
        label="DetalheCelula — abrir uma célula na lista"
        onPress={() => navToTab('CelulasTab', { screen: 'MinhasCelulas' })}
      />
      <DrawerLink
        label="RegistroMembro — após escolher a célula"
        onPress={() => navToTab('CelulasTab', { screen: 'MinhasCelulas' })}
      />
      <DrawerLink
        label="NovaReuniao — após escolher a célula"
        onPress={() => navToTab('CelulasTab', { screen: 'MinhasCelulas' })}
      />
      <DrawerLink
        label="DetalheReuniao — lista na célula"
        onPress={() => navToTab('CelulasTab', { screen: 'MinhasCelulas' })}
      />

      <Text style={styles.section}>Relatórios</Text>
      <DrawerLink
        label="RelatoriosLista — Escolher célula"
        onPress={() =>
          navToTab('RelatoriosTab', { screen: 'RelatoriosLista' })
        }
      />
      <DrawerLink
        label="Relatorio — relatório mensal (escolha a célula antes)"
        onPress={() =>
          navToTab('RelatoriosTab', { screen: 'RelatoriosLista' })
        }
      />

      <Text style={styles.hint}>
        Telas com contexto (detalhe da célula, membro, reunião) abrem a partir
        de Minhas células ou da lista em Relatórios.
      </Text>

      <Text style={styles.section}>Conta</Text>
      <TouchableOpacity
        style={styles.linkDanger}
        onPress={() => closeAnd(confirmSignOut)}
      >
        <Text style={styles.linkDangerText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function DrawerLink({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.link} onPress={onPress} activeOpacity={0.75}>
      <Text style={styles.linkText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: BG,
  },
  content: {
    paddingHorizontal: 14,
  },
  header: {
    backgroundColor: HEADER_BG,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  headerSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  section: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 12,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  link: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 8,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 8,
    fontStyle: 'italic',
    paddingHorizontal: 4,
  },
  linkDanger: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(127,29,29,0.35)',
  },
  linkDangerText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});
