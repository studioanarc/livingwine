/**
 * Color Palette - Tipsy Aesthetic
 * Warm, organic color scheme inspired by natural wine culture
 */

export const Colors = {
  // Primary Colors
  cream: '#FCF8F2',        // Main background - warm cream
  warmBeige: '#F3E4DB',    // Secondary background - soft peach/beige
  terracotta: '#E8B4A0',   // Accent - earthy terracotta

  // Mondrian-inspired Accent Colors
  mondrianBlue: '#4A90E2',    // Vibrant blue
  mondrianRed: '#E63946',     // Bold red
  mondrianYellow: '#F4D35E',  // Sunny yellow

  // Natural Wine Colors
  naturalWineRed: '#8B3A3A',     // Deep wine red
  orangeWine: '#E67E22',         // Orange/amber
  pinkWine: '#E9A6A6',           // Rosé pink
  tipsyWhite: '#F9F6EE',        // Slightly tipsy white

  // Earth Tones
  oliveGreen: '#7C9473',    // Subtle olive
  clayBrown: '#A67C52',     // Warm clay
  grapePurple: '#6B5B95',   // Muted grape

  // Neutrals
  charcoal: '#3A3A3A',      // Dark text
  warmGray: '#8B8680',      // Medium gray with warmth
  lightGray: '#D9D4CE',     // Light borders
  offWhite: '#FEFDFB',      // Brightest white

  // UI States
  success: '#7C9473',       // Olive green
  warning: '#F4D35E',       // Yellow
  error: '#E63946',         // Red
  info: '#4A90E2',          // Blue

  // Shadows & Effects
  shadow: 'rgba(58, 58, 58, 0.15)',
  shadowDark: 'rgba(58, 58, 58, 0.25)',
  shadowLight: 'rgba(58, 58, 58, 0.08)',

  // Letterpress Effect Colors
  letterpressLight: 'rgba(255, 255, 255, 0.8)',
  letterpressDark: 'rgba(0, 0, 0, 0.15)',

  // Overlay
  overlay: 'rgba(58, 58, 58, 0.6)',
  overlayLight: 'rgba(252, 248, 242, 0.9)',
} as const;

/**
 * Semantic Color Mapping
 * Makes it easier to maintain consistent theming
 */
export const SemanticColors = {
  // Backgrounds
  background: {
    primary: Colors.cream,
    secondary: Colors.warmBeige,
    tertiary: Colors.offWhite,
    card: Colors.tipsyWhite,
    overlay: Colors.overlay,
    overlayLight: Colors.overlayLight,
  },

  // Text
  text: {
    primary: Colors.charcoal,
    secondary: Colors.warmGray,
    inverse: Colors.offWhite,
    accent: Colors.naturalWineRed,
    link: Colors.mondrianBlue,
  },

  // Buttons
  button: {
    primary: {
      background: Colors.naturalWineRed,
      text: Colors.offWhite,
      shadow: Colors.shadowDark,
    },
    secondary: {
      background: Colors.mondrianBlue,
      text: Colors.offWhite,
      shadow: Colors.shadowDark,
    },
    accent: {
      background: Colors.orangeWine,
      text: Colors.charcoal,
      shadow: Colors.shadowDark,
    },
    ghost: {
      background: 'transparent',
      text: Colors.charcoal,
      border: Colors.warmGray,
    },
  },

  // Borders
  border: {
    light: Colors.lightGray,
    medium: Colors.warmGray,
    dark: Colors.charcoal,
  },

  // Wine Types
  wine: {
    red: Colors.naturalWineRed,
    orange: Colors.orangeWine,
    white: Colors.tipsyWhite,
    rose: Colors.pinkWine,
    purple: Colors.grapePurple,
  },

  // Status
  status: {
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,
    info: Colors.info,
  },
} as const;

/**
 * Gradient Presets
 */
export const Gradients = {
  sunset: ['#E8B4A0', '#E67E22', '#8B3A3A'],
  earth: ['#F3E4DB', '#A67C52', '#7C9473'],
  wine: ['#E9A6A6', '#8B3A3A', '#6B5B95'],
  cream: ['#FEFDFB', '#FCF8F2', '#F3E4DB'],
  mondrian: ['#4A90E2', '#F4D35E', '#E63946'],
} as const;

export type ColorKey = keyof typeof Colors;
export type SemanticColorKey = keyof typeof SemanticColors;
export type GradientKey = keyof typeof Gradients;
