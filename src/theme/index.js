// Design System — Luz para Vida
// Tokens de design centralizados. Importe desta fonte em todos os estilos.

export const colors = {
  // Primária — Navy profissional
  primary: '#1A3A6B',
  primaryMid: '#1D4ED8',
  primaryLight: '#EEF3FF',
  primaryDark: '#0D1F3C',

  // Acento — Ouro da igreja (mantém identidade da marca)
  accent: '#C9A227',
  accentAlt: '#E8BC3A',
  accentLight: '#FEF9E7',
  accentDark: '#9E7C1A',

  // Semânticas
  success: '#059669',
  successBg: '#D1FAE5',
  warning: '#D97706',
  warningBg: '#FEF3C7',
  error: '#DC2626',
  errorBg: '#FEE2E2',
  info: '#0284C7',
  infoBg: '#E0F2FE',

  // Superfícies
  bg: '#F7F8FC',
  bgAlt: '#EEF1F9',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',

  // Bordas
  border: '#E2E8F2',
  borderLight: '#F0F3FA',
  borderFocus: '#1A3A6B',

  // Texto
  text: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#94A3B8',
  textInverse: '#FFFFFF',
  textAccent: '#C9A227',

  // Drawer (sidebar escuro)
  drawer: '#0D1B38',
  drawerSurface: 'rgba(255,255,255,0.07)',
  drawerBorder: 'rgba(255,255,255,0.09)',
  drawerText: '#F0F4F8',
  drawerMuted: 'rgba(240,244,248,0.52)',

  // Overlay
  overlay: 'rgba(10, 18, 38, 0.52)',
  scrim: 'rgba(10, 18, 38, 0.08)',
};

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
};

export const shadows = {
  xs: {
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sm: {
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.11,
    shadowRadius: 16,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1A3A6B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
};

export const type = {
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 20, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 17, fontWeight: '700', letterSpacing: -0.2 },
  h4: { fontSize: 15, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
  bodySm: { fontSize: 13, fontWeight: '400', lineHeight: 19 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  caption: { fontSize: 12, fontWeight: '500' },
  mono: { fontSize: 13, fontWeight: '600', letterSpacing: 0.2 },
};
