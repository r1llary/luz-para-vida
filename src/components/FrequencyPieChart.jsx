import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const SIZE = 200;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 78;

function polarToCartesian(cx, cy, radius, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy + radius * Math.sin(rad),
  };
}

/** Slice from startDeg to endDeg (degrees), clockwise, starting from top at 0°. */
function slicePath(cx, cy, rInner, startDeg, endDeg) {
  if (endDeg - startDeg <= 0.01) return '';
  const start = polarToCartesian(cx, cy, rInner, endDeg);
  const end = polarToCartesian(cx, cy, rInner, startDeg);
  const largeArc = endDeg - startDeg <= 180 ? 0 : 1;
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    rInner,
    rInner,
    0,
    largeArc,
    0,
    end.x,
    end.y,
    'Z',
  ].join(' ');
}

/**
 * Pizza: presenças vs vagas livres no período (soma de presenças × total de vagas teóricas).
 */
export function FrequencyPieChart({
  somaPresencas,
  totalSlots,
  colorPresencas = '#22c55e',
  colorAusencias = 'rgba(30,41,59,0.55)',
}) {
  const { pathPresencas, pathAusencias } = useMemo(() => {
    const pres = Math.max(0, Number(somaPresencas) || 0);
    const slots = Math.max(0, Number(totalSlots) || 0);
    if (slots <= 0) {
      return {
        pathPresencas: '',
        pathAusencias: slicePath(CX, CY, R, 0, 360),
      };
    }
    const aus = Math.max(0, slots - pres);
    const fracP = Math.min(1, pres / slots);
    const angleP = fracP * 360;
    return {
      pathPresencas:
        angleP > 0.01 ? slicePath(CX, CY, R, 0, angleP) : '',
      pathAusencias:
        aus > 0 ? slicePath(CX, CY, R, angleP, 360) : '',
    };
  }, [somaPresencas, totalSlots]);

  const semDados = totalSlots <= 0;
  const pres = Math.max(0, Number(somaPresencas) || 0);
  const slots = Math.max(0, Number(totalSlots) || 0);
  const cheioPresencas = slots > 0 && pres >= slots;
  const cheioAusencias = slots > 0 && pres <= 0;

  return (
    <View style={styles.wrap}>
      <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {semDados ? (
          <Circle cx={CX} cy={CY} r={R} fill={colorAusencias} />
        ) : cheioAusencias ? (
          <Circle cx={CX} cy={CY} r={R} fill={colorAusencias} />
        ) : cheioPresencas ? (
          <Circle cx={CX} cy={CY} r={R} fill={colorPresencas} />
        ) : (
          <>
            {pathAusencias ? (
              <Path d={pathAusencias} fill={colorAusencias} />
            ) : null}
            {pathPresencas ? (
              <Path d={pathPresencas} fill={colorPresencas} />
            ) : null}
          </>
        )}
      </Svg>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colorPresencas }]} />
          <Text style={styles.legendText}>Presenças</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colorAusencias }]} />
          <Text style={styles.legendText}>
            {semDados ? 'Sem vagas no período' : 'Ausências (vagas)'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.88)',
  },
});
