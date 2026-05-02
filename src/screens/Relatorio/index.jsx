import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { FrequencyPieChart } from '../../components/FrequencyPieChart';
import { styles } from './styles';
import { useRelatorioScreen } from './useRelatorioScreen';

export default function Relatorio() {
  const {
    podeMostrar,
    todasCelulas,
    celulaTitulo,
    control,
    errors,
    filtradas,
    gruposPorCelula,
    totais,
    frequenciaStats,
    formatDateBr,
    openReuniao,
    gerarPdfRelatorio,
    initialPeriod,
    usaPeriodoDaLista,
    periodoOrdenado,
  } = useRelatorioScreen();

  const [pdfBusy, setPdfBusy] = React.useState(false);

  const onPdfPress = async () => {
    setPdfBusy(true);
    try {
      await gerarPdfRelatorio();
    } finally {
      setPdfBusy(false);
    }
  };

  if (!podeMostrar) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.error}>Relatório não disponível.</Text>
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
      <Text style={styles.subtitle}>{celulaTitulo}</Text>
      {usaPeriodoDaLista ? (
        <Text style={styles.hint}>
          Período: {formatDateBr(periodoOrdenado.inicio)} —{' '}
          {formatDateBr(periodoOrdenado.fim)}
        </Text>
      ) : (
        <Text style={styles.hint}>
          Escolha o mês e o ano para ver as reuniões e totais.
        </Text>
      )}

      {!usaPeriodoDaLista ? (
        <View style={styles.rowInputs}>
          <View style={[styles.inputHalf, styles.inputHalfLeft]}>
            <Controller
              control={control}
              name="mes"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Mês (1–12)"
                  value={
                    value === '' || value === undefined || value === null
                      ? ''
                      : String(value)
                  }
                  onChangeText={(v) => {
                    const digits = v.replace(/[^\d]/g, '');
                    if (digits === '') {
                      onChange(initialPeriod.mes);
                      return;
                    }
                    let n = Number(digits);
                    if (n < 1) n = 1;
                    if (n > 12) n = 12;
                    onChange(n);
                  }}
                  onBlur={onBlur}
                  error={errors.mes?.message}
                  keyboardType="number-pad"
                />
              )}
            />
          </View>
          <View style={[styles.inputHalf, styles.inputHalfRight]}>
            <Controller
              control={control}
              name="ano"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  variant="auth"
                  placeholder="Ano (ex.: 2026)"
                  value={
                    value === '' || value === undefined || value === null
                      ? ''
                      : String(value)
                  }
                  onChangeText={(v) => {
                    const digits = v.replace(/[^\d]/g, '');
                    if (digits === '') {
                      onChange(initialPeriod.ano);
                      return;
                    }
                    onChange(Number(digits));
                  }}
                  onBlur={onBlur}
                  error={errors.ano?.message}
                  keyboardType="number-pad"
                />
              )}
            />
          </View>
        </View>
      ) : null}

      <View style={styles.cardResumo}>
        <Text style={styles.resumoTitulo}>Resumo do período</Text>
        <Text style={styles.resumoLinha}>
          Reuniões: <Text style={styles.resumoNum}>{totais.reunioes}</Text>
        </Text>
        <Text style={styles.resumoLinha}>
          Total visitantes:{' '}
          <Text style={styles.resumoNum}>{totais.visitantes}</Text>
        </Text>
        <Text style={styles.resumoLinha}>
          Soma membros presentes:{' '}
          <Text style={styles.resumoNum}>{totais.membrosPresentes}</Text>
        </Text>
      </View>

      {usaPeriodoDaLista && frequenciaStats ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Frequência no período</Text>
          <Text style={styles.chartSub}>
            {formatDateBr(periodoOrdenado.inicio)} —{' '}
            {formatDateBr(periodoOrdenado.fim)} ·{' '}
            {frequenciaStats.reunioesCount} reunião(ões)
          </Text>
          <FrequencyPieChart
            somaPresencas={frequenciaStats.somaPresencas}
            totalSlots={frequenciaStats.totalSlots}
          />
          <View style={styles.chartStats}>
            <Text style={styles.chartStatLine}>
              <Text style={styles.chartStatLabel}>Número de membros: </Text>
              <Text style={styles.chartStatValue}>
                {frequenciaStats.totalMembros}
              </Text>
            </Text>
            <Text style={styles.chartStatLine}>
              <Text style={styles.chartStatLabel}>Taxa de frequência (%): </Text>
              <Text style={styles.chartStatValue}>
                {frequenciaStats.taxaFrequenciaPct == null
                  ? '—'
                  : `${frequenciaStats.taxaFrequenciaPct}%`}
              </Text>
            </Text>
            <Text style={styles.chartStatLine}>
              <Text style={styles.chartStatLabel}>Número de visitantes: </Text>
              <Text style={styles.chartStatValue}>
                {frequenciaStats.numeroVisitantes}
              </Text>
            </Text>
          </View>
        </View>
      ) : null}

      {usaPeriodoDaLista ? (
        <TouchableOpacity
          style={[styles.pdfBtn, filtradas.length === 0 && styles.pdfBtnDisabled]}
          onPress={onPdfPress}
          disabled={filtradas.length === 0 || pdfBusy}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Gerar relatório em PDF"
        >
          {pdfBusy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.pdfBtnText}>Gerar relatório em PDF</Text>
          )}
        </TouchableOpacity>
      ) : null}

      <Text style={styles.secReunioes}>
        {usaPeriodoDaLista ? 'Reuniões no período' : 'Reuniões no mês'}
      </Text>
      {filtradas.length === 0 ? (
        <Text style={styles.empty}>
          {usaPeriodoDaLista
            ? 'Nenhuma reunião neste período.'
            : 'Nenhuma reunião neste mês.'}
        </Text>
      ) : todasCelulas && gruposPorCelula ? (
        gruposPorCelula.map((g) => (
          <View key={g.celulaId} style={styles.grupoBlock}>
            <Text style={styles.grupoTitulo}>{g.nomeCelula}</Text>
            {g.reunioes.map((r) => (
              <TouchableOpacity
                key={r.id}
                style={styles.reuniaoRow}
                onPress={() => openReuniao(r)}
                activeOpacity={0.85}
              >
                <Text style={styles.reuniaoData}>
                  {formatDateBr(r.dataReuniao || r.data)}
                </Text>
                <Text style={styles.reuniaoTema} numberOfLines={2}>
                  {r.temaMinistrado || '—'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))
      ) : (
        filtradas.map((r) => (
          <TouchableOpacity
            key={r.id}
            style={styles.reuniaoRow}
            onPress={() => openReuniao(r)}
            activeOpacity={0.85}
          >
            <Text style={styles.reuniaoData}>
              {formatDateBr(r.dataReuniao || r.data)}
            </Text>
            <Text style={styles.reuniaoTema} numberOfLines={2}>
              {r.temaMinistrado || '—'}
            </Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}
