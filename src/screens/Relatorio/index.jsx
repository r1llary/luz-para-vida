import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { styles } from './styles';
import { useRelatorioScreen, MONTH_NAMES_FULL } from './useRelatorioScreen';

const TABS = [
  { key: 'frequencia', label: 'Frequência' },
  { key: 'visitantes', label: 'Visitantes' },
  { key: 'reunioes', label: 'Reuniões' },
];

function BarChart({ data }) {
  const maxVal = Math.max(...data.map((d) => d.total), 1);
  return (
    <View style={styles.chartContainer}>
      {data.map((item, i) => {
        const barH = item.total > 0 ? Math.max((item.total / maxVal) * 80, 4) : 0;
        return (
          <View key={i} style={styles.chartCol}>
            {item.total > 0 && (
              <Text style={styles.chartValue}>{item.total}</Text>
            )}
            <View style={[styles.chartBar, { height: barH }]} />
            <Text style={styles.chartLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

export default function Relatorio() {
  const {
    celula,
    mes,
    ano,
    prevMonth,
    nextMonth,
    filtradas,
    totais,
    frequencia,
    visitantesList,
    evolucaoVisitantes,
    formatDateBr,
    openReuniao,
    activeTab,
    setActiveTab,
    exportingPdf,
    exportPdf,
  } = useRelatorioScreen();

  if (!celula) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.error}>Célula não encontrada.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollOuter}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>RELATÓRIO MENSAL</Text>
      <Text style={styles.subtitle}>{celula.nomeCelula}</Text>

      {/* Seletor de mês/ano */}
      <View style={styles.periodRow}>
        <TouchableOpacity
          style={styles.periodArrow}
          onPress={prevMonth}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
        >
          <Text style={styles.periodArrowText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.periodLabel}>
          {MONTH_NAMES_FULL[mes - 1]} {ano}
        </Text>

        <TouchableOpacity
          style={styles.periodArrow}
          onPress={nextMonth}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 4, right: 4 }}
        >
          <Text style={styles.periodArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* KPIs */}
      <View style={styles.kpiRow}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNum}>{totais.reunioes}</Text>
          <Text style={styles.kpiLabel}>Reuniões</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiNum}>{totais.visitantes}</Text>
          <Text style={styles.kpiLabel}>Visitantes</Text>
        </View>
        <View style={[styles.kpiCard, styles.kpiCardLast]}>
          <Text style={styles.kpiNum}>{totais.membrosPresentes}</Text>
          <Text style={styles.kpiLabel}>Presenças</Text>
        </View>
      </View>

      {/* Exportar PDF */}
      <TouchableOpacity
        style={styles.pdfBtn}
        onPress={exportPdf}
        activeOpacity={0.85}
        disabled={exportingPdf}
      >
        {exportingPdf ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.pdfBtnText}>Exportar PDF</Text>
        )}
      </TouchableOpacity>

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
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Aba: Frequência */}
      {activeTab === 'frequencia' && (
        <>
          {frequencia.length === 0 ? (
            <Text style={styles.empty}>
              {filtradas.length === 0
                ? 'Nenhuma reunião neste mês.'
                : 'Sem dados de presença registrados.'}
            </Text>
          ) : (
            frequencia.map((f) => {
              const cor =
                f.pct >= 0.75 ? '#22C55E' : f.pct >= 0.5 ? '#C9A227' : '#EF4444';
              return (
                <View key={f.id} style={styles.freqRow}>
                  <View style={styles.freqTop}>
                    <Text style={styles.freqNome} numberOfLines={1}>
                      {f.pct < 0.5 ? '⚠ ' : ''}{f.nome}
                    </Text>
                    <Text style={[styles.freqPct, { color: cor }]}>
                      {f.presencas}/{f.total} ({Math.round(f.pct * 100)}%)
                    </Text>
                  </View>
                  <View style={styles.freqBar}>
                    <View
                      style={[
                        styles.freqFill,
                        { width: `${Math.round(f.pct * 100)}%`, backgroundColor: cor },
                      ]}
                    />
                  </View>
                </View>
              );
            })
          )}
        </>
      )}

      {/* Aba: Visitantes */}
      {activeTab === 'visitantes' && (
        <>
          <View style={styles.chartWrap}>
            <Text style={styles.chartTitle}>
              Evolução de visitantes (últimos 6 meses)
            </Text>
            <BarChart data={evolucaoVisitantes} />
          </View>

          <Text style={styles.secReunioes}>Visitantes do mês</Text>
          {visitantesList.length === 0 ? (
            <Text style={styles.empty}>
              Nenhum visitante registrado neste mês.
            </Text>
          ) : (
            visitantesList.map((v, i) => (
              <View key={i} style={styles.visitRow}>
                <Text style={styles.visitNome}>{v.nome}</Text>
                {v.contato ? (
                  <Text style={styles.visitContato}>{v.contato}</Text>
                ) : null}
                <Text style={styles.visitMeta}>
                  Reunião: {formatDateBr(v.reuniaoData)}
                </Text>
              </View>
            ))
          )}
        </>
      )}

      {/* Aba: Reuniões */}
      {activeTab === 'reunioes' && (
        <>
          {filtradas.length === 0 ? (
            <Text style={styles.empty}>Nenhuma reunião neste mês.</Text>
          ) : (
            filtradas.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.reuniaoRow}
                onPress={() => openReuniao(r)}
                activeOpacity={0.85}
              >
                <Text style={styles.reuniaoData}>
                  {formatDateBr(r.dataReuniao)}
                </Text>
                <Text style={styles.reuniaoTema} numberOfLines={2}>
                  {r.temaMinistrado || '—'}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </>
      )}
    </ScrollView>
  );
}
