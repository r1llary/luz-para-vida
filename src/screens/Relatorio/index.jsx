import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Controller } from 'react-hook-form';
import { Input } from '../../components/Inputs';
import { styles } from './styles';
import { useRelatorioScreen } from './useRelatorioScreen';

export default function Relatorio() {
  const {
    celula,
    control,
    errors,
    filtradas,
    totais,
    formatDateBr,
    openReuniao,
    initialPeriod,
    usaPeriodoDaLista,
    periodoInicio,
    periodoFim,
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
      {usaPeriodoDaLista ? (
        <Text style={styles.hint}>
          Período: {formatDateBr(periodoInicio)} — {formatDateBr(periodoFim)}
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

      <Text style={styles.secReunioes}>
        {usaPeriodoDaLista ? 'Reuniões no período' : 'Reuniões no mês'}
      </Text>
      {filtradas.length === 0 ? (
        <Text style={styles.empty}>
          {usaPeriodoDaLista
            ? 'Nenhuma reunião neste período.'
            : 'Nenhuma reunião neste mês.'}
        </Text>
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
