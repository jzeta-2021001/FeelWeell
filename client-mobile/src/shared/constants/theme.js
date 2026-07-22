// src/shared/constants/theme.js

export const COLORS = {
  primary: '#6d72d8', // fw-purple
  primaryLight: '#8b91ef', // fw-purple-light
  primaryBg: '#edefff', // fw-purple-bg (fondos suaves, chips inactivos)
  secondary: '#d14b6d', // fw-pink (acentos, alertas suaves, bubble del usuario en Tiyú)
  gray: '#7b8094', // fw-gray (texto terciario)
  background: '#f6f7fb', // fondo general de pantallas
  surface: '#ffffff', // cards
  surfaceAlt: '#f0eaff', // filas alternadas / banners suaves
  border: 'rgba(109,114,216,0.15)',
  text: '#232336',
  textSecondary: '#5b5f73',
  textMuted: '#9498ab',
  error: '#d14b6d',
  success: '#4caf50',
  warning: '#ff9800',
  critical: '#e0334f', // alertas de crisis / severidad CRÍTICO
  inputBg: '#f6f7fb',
  inputBorder: 'rgba(109,114,216,0.2)',
  gradient: ['#e6c8ff', '#cfd1ff', '#b9c9f5'], // fw-gradient (fondos decorativos)
  userGradient: ['#f0eaff', '#e8ecff', '#dde7ff'], // fw-user-gradient
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONT_SIZE = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 26,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
};

// Sombra suave y cálida, pensada para fondos claros (nada de sombras duras/oscuras)
export const SHADOWS = {
  soft: {
    shadowColor: '#6d72d8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  card: {
    shadowColor: '#232336',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};

export const theme = { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOWS };

export default theme;
