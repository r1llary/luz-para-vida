import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { useCelulas } from '../../contexts/CelulasContext';
import { formatDateBr } from '../../utils/date';
import { styles } from './styles';

const TABS = [
  { key: 'membros', label: 'Membros' },
  { key: 'visitantes', label: 'Visitantes' },
];

function initials(name = '') {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() || '?';
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function buildAddress(m) {
  const parts = [
    m.rua && m.numero ? `${m.rua}, ${m.numero}` : m.rua,
    m.complemento,
    m.bairro,
    m.cidade,
    m.cep,
  ].filter(Boolean);
  return parts.join(' · ') || null;
}

export default function MembrosCelula() {
  const { params } = useRoute();
  const celula = params?.celula;
  const { getMembrosByCelula, getReunioesByCelula, fetchMembrosForCelula } = useCelulas();
  const [activeTab, setActiveTab] = useState('membros');

  useFocusEffect(
    useCallback(() => {
      if (celula?.id) fetchMembrosForCelula(celula.id);
    }, [celula?.id, fetchMembrosForCelula])
  );

  const membros = celula ? getMembrosByCelula(celula.id) : [];

  const visitantes = useMemo(() => {
    if (!celula) return [];
    const reunioes = getReunioesByCelula(celula.id);
    const list = [];
    for (const r of reunioes) {
      const det = r.visitantesDetalhes;
      if (Array.isArray(det)) {
        for (const v of det) {
          if (v?.nome) {
            list.push({
              nome: v.nome,
              contato: v.contato || '',
              reuniaoData: r.dataReuniao,
            });
          }
        }
      }
    }
    return list.sort((a, b) =>
      String(b.reuniaoData || '').localeCompare(String(a.reuniaoData || ''))
    );
  }, [celula, getReunioesByCelula]);

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <StatusBar style="light" />

      {/* Abas */}
      <View style={styles.tabRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>
              {t.label}
              {t.key === 'membros' ? ` (${membros.length})` : ` (${visitantes.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Aba Membros ── */}
        {activeTab === 'membros' && (
          <>
            {membros.length === 0 ? (
              <Text style={styles.empty}>Nenhum membro cadastrado.</Text>
            ) : (
              membros.map((m) => (
                <View key={m.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{initials(m.nomeCompleto)}</Text>
                    </View>
                    <Text style={styles.nome} numberOfLines={2}>{m.nomeCompleto}</Text>
                  </View>
                  <View style={styles.divider} />
                  <InfoRow label="E-mail" value={m.email} />
                  <InfoRow label="Telefone" value={m.telefone} />
                  <InfoRow label="Endereço" value={buildAddress(m)} />
                  <InfoRow label="Nascimento" value={m.data ? formatDateBr(m.data) : null} />
                  <InfoRow label="CPF / RG" value={m.cpfRg} />
                </View>
              ))
            )}
          </>
        )}

        {/* ── Aba Visitantes ── */}
        {activeTab === 'visitantes' && (
          <>
            {visitantes.length === 0 ? (
              <Text style={styles.empty}>Nenhum visitante registrado.</Text>
            ) : (
              visitantes.map((v, i) => (
                <View key={i} style={styles.visitCard}>
                  <View style={styles.visitHeader}>
                    <View style={[styles.avatar, styles.avatarVisit]}>
                      <Text style={styles.avatarText}>{initials(v.nome)}</Text>
                    </View>
                    <View style={styles.visitInfo}>
                      <Text style={styles.nome} numberOfLines={1}>{v.nome}</Text>
                      {v.contato ? (
                        <Text style={styles.contato}>{v.contato}</Text>
                      ) : null}
                    </View>
                  </View>
                  <Text style={styles.visitData}>
                    Reunião: {formatDateBr(v.reuniaoData)}
                  </Text>
                </View>
              ))
            )}
          </>
        )}

        <Text style={styles.footer}>Luz para Vida · Ana Rillary</Text>
      </ScrollView>
    </SafeAreaView>
  );
}
