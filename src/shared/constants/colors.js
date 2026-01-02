/**
 * Design System - Color Palette
 * Paleta de colores oficial del sistema de diseño
 */

export const colors = {
  // Primary - Naranja cálido (identidad de marca)
  primary: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316", // Principal
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },

  // Secondary - Gris neutro
  secondary: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a", // Principal
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },

  // Accent - Verde éxito
  accent: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e", // Principal
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },

  // Semantic Colors
  semantic: {
    success: "#22c55e",
    warning: "#eab308",
    error: "#ef4444",
    info: "#3b82f6",
  },

  // Background
  background: {
    default: "#fafafa",
    card: "#ffffff",
    elevated: "#ffffff",
  },

  // Text
  text: {
    primary: "#18181b",
    secondary: "#52525b",
    muted: "#a1a1aa",
    inverse: "#ffffff",
  },

  // Border
  border: {
    light: "#e4e4e7",
    medium: "#d4d4d8",
    focus: "#f97316",
  },
};

/**
 * CSS Variables para usar en hojas de estilo
 */
export const cssVariables = `
  :root {
    /* Primary */
    --primary-50: ${colors.primary[50]};
    --primary-100: ${colors.primary[100]};
    --primary-200: ${colors.primary[200]};
    --primary-300: ${colors.primary[300]};
    --primary-400: ${colors.primary[400]};
    --primary-500: ${colors.primary[500]};
    --primary-600: ${colors.primary[600]};
    --primary-700: ${colors.primary[700]};
    --primary-800: ${colors.primary[800]};
    --primary-900: ${colors.primary[900]};

    /* Secondary */
    --secondary-50: ${colors.secondary[50]};
    --secondary-100: ${colors.secondary[100]};
    --secondary-200: ${colors.secondary[200]};
    --secondary-300: ${colors.secondary[300]};
    --secondary-400: ${colors.secondary[400]};
    --secondary-500: ${colors.secondary[500]};
    --secondary-600: ${colors.secondary[600]};
    --secondary-700: ${colors.secondary[700]};
    --secondary-800: ${colors.secondary[800]};
    --secondary-900: ${colors.secondary[900]};

    /* Semantic */
    --success: ${colors.semantic.success};
    --warning: ${colors.semantic.warning};
    --error: ${colors.semantic.error};
    --info: ${colors.semantic.info};

    /* Background */
    --background: ${colors.background.default};
    --background-card: ${colors.background.card};
    --background-elevated: ${colors.background.elevated};

    /* Text */
    --text-primary: ${colors.text.primary};
    --text-secondary: ${colors.text.secondary};
    --text-muted: ${colors.text.muted};
    --text-inverse: ${colors.text.inverse};

    /* Border */
    --border-light: ${colors.border.light};
    --border-medium: ${colors.border.medium};
    --border-focus: ${colors.border.focus};
  }
`;

export default colors;
