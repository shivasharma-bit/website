export const colors = {
  neutral: {
    0:   '#FFFFFF',
    50:  '#F7F6F3',
    100: '#EEECE7',
    200: '#D9D6CE',
    300: '#B8B4AA',
    400: '#8F8B82',
    500: '#6B6760',
    600: '#4A4740',
    700: '#302E28',
    800: '#1E1C18',
    900: '#111009',
    950: '#0A0906',
  },
  brand: {
    50:  '#EEF1F7',
    100: '#D5DCF0',
    200: '#9EAAD6',
    300: '#6678B8',
    400: '#3A509E',
    500: '#1F3480',
    600: '#162666',
    700: '#0F1A4A',
    800: '#091030',
    900: '#040818',
  },
  accent: {
    50:  '#FFF8EC',
    100: '#FDEAC8',
    200: '#FAC97A',
    300: '#F5A623',
    400: '#E08C00',
    500: '#B87000',
  },
  semantic: {
    success: '#2D6A4F',
    warning: '#B45309',
    error:   '#9B1C1C',
    info:    '#1E3A5F',
  },
} as const;

export const fontFamily = {
  display: "'Playfair Display', Georgia, serif",
  body:    "'Inter', system-ui, -apple-system, sans-serif",
  mono:    "'JetBrains Mono', 'Fira Code', monospace",
} as const;

export const fontSize = {
  xs:   '0.75rem',
  sm:   '0.875rem',
  base: '1rem',
  lg:   '1.125rem',
  xl:   '1.25rem',
  '2xl':'1.5rem',
  '3xl':'1.875rem',
  '4xl':'2.25rem',
  '5xl':'3rem',
  '6xl':'3.75rem',
} as const;

export const spacing = {
  1:  '0.25rem',
  2:  '0.5rem',
  3:  '0.75rem',
  4:  '1rem',
  5:  '1.25rem',
  6:  '1.5rem',
  8:  '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
} as const;

export const borderRadius = {
  sm:   '4px',
  md:   '8px',
  lg:   '12px',
  xl:   '16px',
  full: '9999px',
} as const;

export const avatarSizes = {
  xs: 32,
  sm: 40,
  md: 48,
  lg: 64,
  xl: 96,
  '2xl': 128,
} as const;
