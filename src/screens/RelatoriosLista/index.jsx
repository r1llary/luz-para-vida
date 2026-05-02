import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Platform,
  FlatList,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FrequencyPieChart } from '../../components/FrequencyPieChart';
import {
  isoDateToLocalDate,
  localDateToIso,
} from '../../utils/brFormat';
import { styles } from './styles';
import { useRelatoriosListaScreen } from './useRelatoriosListaScreen';

const LOGO_HEADER = require('../../../assets/logo.png');

function ScreenHeader({ onOpenMenu }) {
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
        Relatórios
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

export default function RelatoriosLista() {
  const insets = useSafeAreaInsets();
  const {
    elegiveis,
    pickerItems,
    selectedCelulaId,
    setSelectedCelulaId,
    selectedCelulaLabel,
    isTodasCelulas,
    celulaPickerOpen,
    setCelulaPickerOpen,
    dataInicio,
    dataFim,
    formatIsoDateBr,
    frequenciaStats,
    openDrawer,
    openRelatorioDetalhe,
    openDatePicker,
    closeDatePicker,
    applyPickedDate,
    showAndroidDatePicker,
    iosDateModalOpen,
    activeDateField,
    currentPickerIso,
    periodoOrdenado,
  } = useRelatoriosListaScreen();

  const onAndroidDateChange = useCallback(
    (event, date) => {
      if (event.type === 'dismissed') {
        closeDatePicker();
        return;
      }
      if (date) applyPickedDate(localDateToIso(date));
      closeDatePicker();
    },
    [applyPickedDate, closeDatePicker]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar style="light" />
      <ScreenHeader onOpenMenu={openDrawer} />
      <ScrollView
        style={styles.scrollFlex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Frequência por célula (membros cadastrados × presenças no período). Células
          em que você é líder/dono ou ligadas à sua rede (campo célula raiz).
        </Text>

        {elegiveis.length === 0 ? (
          <Text style={styles.empty}>
            Nenhuma célula disponível para relatório. Você precisa ser líder ou dono
            de uma célula, ou ter células filhas vinculadas pela célula raiz.
          </Text>
        ) : (
          <>
            <Text style={styles.fieldLabel}>Célula</Text>
            <TouchableOpacity
              style={styles.selectTouchable}
              onPress={() => setCelulaPickerOpen(true)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Selecionar célula"
            >
              <Text style={styles.selectValue} numberOfLines={2}>
                {selectedCelulaLabel}
              </Text>
              <Text style={styles.selectChevron}>▼</Text>
            </TouchableOpacity>

            <View style={styles.periodRow}>
              <View style={styles.periodHalf}>
                <Text style={styles.fieldLabel}>Data inicial</Text>
                <TouchableOpacity
                  style={styles.dateChip}
                  onPress={() => openDatePicker('inicio')}
                >
                  <Text style={styles.dateChipText}>
                    {formatIsoDateBr(dataInicio)}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.periodHalf, styles.periodHalfRight]}>
                <Text style={styles.fieldLabel}>Data final</Text>
                <TouchableOpacity
                  style={styles.dateChip}
                  onPress={() => openDatePicker('fim')}
                >
                  <Text style={styles.dateChipText}>
                    {formatIsoDateBr(dataFim)}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Frequência no período</Text>
              <Text style={styles.chartSub}>
                {formatIsoDateBr(periodoOrdenado.inicio)} —{' '}
                {formatIsoDateBr(periodoOrdenado.fim)} ·{' '}
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
                <Text style={styles.chartStatLine}>
                  <Text style={styles.chartStatLabel}>
                    Visitantes recorrentes (mais de uma vez no período):{' '}
                  </Text>
                  <Text style={styles.chartStatValue}>
                    {frequenciaStats.visitantesRecorrentes}
                  </Text>
                </Text>
              </View>
              <Text style={styles.chartHint}>
                {isTodasCelulas
                  ? 'No consolidado, membros somam cadastros em cada célula (a mesma pessoa em duas células conta duas vezes). A pizza mostra presenças em relação ao total de vagas (membros × reuniões). Visitantes recorrentes usam o nome cadastrado em mais de uma reunião.'
                  : 'A taxa compara a soma das presenças ao total de vagas (membros × reuniões no período). Visitantes: nomes distintos quando há lista; caso contrário, soma dos registros. Recorrentes: mesmo nome em duas ou mais reuniões.'}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.linkBtn, isTodasCelulas && styles.linkBtnDisabled]}
              onPress={openRelatorioDetalhe}
              activeOpacity={0.9}
              disabled={isTodasCelulas}
              accessibilityState={{ disabled: isTodasCelulas }}
            >
              <Text style={styles.linkBtnText}>
                {isTodasCelulas
                  ? 'Escolha uma célula para listar reuniões'
                  : 'Ver reuniões do período'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      <Modal
        visible={celulaPickerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCelulaPickerOpen(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setCelulaPickerOpen(false)}
        >
          <Pressable
            style={[styles.modalCard, { paddingBottom: Math.max(insets.bottom, 16) }]}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Escolher célula</Text>
            <FlatList
              data={pickerItems}
              keyExtractor={(item) => item.id}
              style={styles.modalList}
              renderItem={({ item }) => {
                const on = item.id === selectedCelulaId;
                return (
                  <TouchableOpacity
                    style={[styles.modalRow, on && styles.modalRowOn]}
                    onPress={() => {
                      setSelectedCelulaId(item.id);
                      setCelulaPickerOpen(false);
                    }}
                  >
                    <Text style={styles.modalRowText} numberOfLines={2}>
                      {item.nomeCelula}
                    </Text>
                    {on ? <Text style={styles.modalCheck}>✓</Text> : null}
                  </TouchableOpacity>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>

      {showAndroidDatePicker && activeDateField ? (
        <DateTimePicker
          value={isoDateToLocalDate(currentPickerIso)}
          mode="date"
          display="default"
          onChange={onAndroidDateChange}
        />
      ) : null}

      {Platform.OS === 'ios' && iosDateModalOpen && activeDateField ? (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={closeDatePicker}
        >
          <Pressable style={styles.dateModalOverlay} onPress={closeDatePicker}>
            <Pressable
              style={[
                styles.dateModalCard,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
              onPress={(e) => e.stopPropagation()}
            >
              <DateTimePicker
                value={isoDateToLocalDate(currentPickerIso)}
                mode="date"
                display="inline"
                themeVariant="light"
                onChange={(_, date) => {
                  if (date) applyPickedDate(localDateToIso(date));
                }}
              />
              <TouchableOpacity style={styles.dateModalDone} onPress={closeDatePicker}>
                <Text style={styles.dateModalDoneText}>Concluir</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      ) : null}
    </SafeAreaView>
  );
}
