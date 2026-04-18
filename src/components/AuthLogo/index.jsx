import React, { useMemo } from 'react';
import { View, Image, StyleSheet, useWindowDimensions } from 'react-native';

const LOGO = require('../../../assets/logo.png');

export function AuthLogo({ style }) {
  const { width } = useWindowDimensions();
  const logoSize = useMemo(() => {
    const horizontalPadding = 56;
    const w = Math.min(Math.max(width - horizontalPadding, 180), 300);
    const h = Math.min(Math.round(w * 0.46), 132);
    return { width: w, height: h };
  }, [width]);

  return (
    <View style={[styles.wrap, style]}>
      <Image
        source={LOGO}
        style={[styles.logoBase, logoSize]}
        resizeMode="contain"
        accessibilityRole="image"
        accessibilityLabel="Luz para a Vida — Igreja Cristã"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: '100%',
  },
  logoBase: {
    alignSelf: 'center',
  },
});
