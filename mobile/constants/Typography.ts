/**
 * Typography System - Tipsy Aesthetic
 * Font families, sizes, weights, and text styles with letterpress effect
 */

import { TextStyle } from 'react-native';
import { Colors } from './Colors';

/**
 * Font Families
 * Note: These need to be loaded in app/_layout.tsx using expo-font
 */
export const FontFamily = {
  // Display & Headers - Serif with character
  display: 'Fraunces',          // Variable font, decorative serif
  displayBold: 'Fraunces-Bold',
  displayBlack: 'Fraunces-Black',

  // Body Text - Clean sans-serif
  body: 'CabinetGrotesk',       // Geometric sans-serif
  bodyMedium: 'CabinetGrotesk-Medium',
  bodyBold: 'CabinetGrotesk-Bold',

  // UI Elements - Modern sans-serif
  ui: 'Inter',                  // Clean, highly legible
  uiMedium: 'Inter-Medium',
  uiSemiBold: 'Inter-SemiBold',
  uiBold: 'Inter-Bold',

  // Handwritten Accents
  accent: 'Caveat',             // Handwritten feel for special elements
  accentBold: 'Caveat-Bold',
} as const;

/**
 * Font Sizes
 * Using a fluid scale based on major third ratio (1.250)
 */
export const FontSize = {
  xs: 12,      // Small labels, captions
  sm: 14,      // Secondary text
  base: 16,    // Body text
  md: 18,      // Emphasized body
  lg: 20,      // Small headings
  xl: 24,      // Section headings
  '2xl': 30,   // Page headings
  '3xl': 36,   // Display headings
  '4xl': 48,   // Hero text
  '5xl': 60,   // Extra large display
} as const;

/**
 * Font Weights
 */
export const FontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  black: '900' as TextStyle['fontWeight'],
} as const;

/**
 * Line Heights
 * Relative to font size for better readability
 */
export const LineHeight = {
  tight: 1.1,    // Display text
  snug: 1.3,     // Headings
  normal: 1.5,   // Body text
  relaxed: 1.7,  // Long-form reading
  loose: 2,      // Very open
} as const;

/**
 * Letter Spacing
 */
export const LetterSpacing = {
  tighter: -0.05,
  tight: -0.025,
  normal: 0,
  wide: 0.025,
  wider: 0.05,
  widest: 0.1,
} as const;

/**
 * Letterpress Effect Generator
 * Creates subtle depth effect on text
 */
export const letterpressEffect = (
  mode: 'light' | 'dark' = 'light'
): TextStyle => ({
  textShadowColor: mode === 'light'
    ? Colors.letterpressLight
    : Colors.letterpressDark,
  textShadowOffset: {
    width: 0,
    height: mode === 'light' ? 1 : -1
  },
  textShadowRadius: 0,
});

/**
 * 3D Text Shadow Effect
 * Creates layered shadow for depth
 */
export const textShadow3D = (
  color: string = Colors.shadow,
  depth: number = 3
): TextStyle => ({
  textShadowColor: color,
  textShadowOffset: { width: 0, height: depth },
  textShadowRadius: depth * 2,
});

/**
 * Predefined Text Styles
 */
export const TextStyles = {
  // Display Styles - Hero text, large headings
  display: {
    fontFamily: FontFamily.display,
    fontSize: FontSize['4xl'],
    fontWeight: FontWeight.black,
    lineHeight: FontSize['4xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    color: Colors.charcoal,
    ...letterpressEffect('dark'),
  } as TextStyle,

  displayLarge: {
    fontFamily: FontFamily.displayBlack,
    fontSize: FontSize['5xl'],
    fontWeight: FontWeight.black,
    lineHeight: FontSize['5xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tighter,
    color: Colors.charcoal,
    ...letterpressEffect('dark'),
  } as TextStyle,

  displayMedium: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['3xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['3xl'] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    color: Colors.charcoal,
    ...letterpressEffect('dark'),
  } as TextStyle,

  // Heading Styles
  h1: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    lineHeight: FontSize['2xl'] * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
    color: Colors.charcoal,
    ...letterpressEffect('dark'),
  } as TextStyle,

  h2: {
    fontFamily: FontFamily.displayBold,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
    color: Colors.charcoal,
    ...letterpressEffect('dark'),
  } as TextStyle,

  h3: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.lg * LineHeight.snug,
    letterSpacing: LetterSpacing.wide,
    color: Colors.charcoal,
  } as TextStyle,

  h4: {
    fontFamily: FontFamily.bodyBold,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.md * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
    color: Colors.charcoal,
  } as TextStyle,

  // Body Styles
  bodyLarge: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.relaxed,
    letterSpacing: LetterSpacing.normal,
    color: Colors.charcoal,
  } as TextStyle,

  body: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.charcoal,
  } as TextStyle,

  bodyMedium: {
    fontFamily: FontFamily.bodyMedium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.charcoal,
  } as TextStyle,

  bodySmall: {
    fontFamily: FontFamily.body,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.warmGray,
  } as TextStyle,

  // UI Text Styles
  button: {
    fontFamily: FontFamily.uiBold,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.base * LineHeight.tight,
    letterSpacing: LetterSpacing.wider,
    textTransform: 'uppercase' as TextStyle['textTransform'],
  } as TextStyle,

  label: {
    fontFamily: FontFamily.uiSemiBold,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.wide,
    textTransform: 'uppercase' as TextStyle['textTransform'],
    color: Colors.warmGray,
  } as TextStyle,

  caption: {
    fontFamily: FontFamily.ui,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.xs * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.warmGray,
  } as TextStyle,

  // Accent/Handwritten Styles
  accent: {
    fontFamily: FontFamily.accent,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.lg * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
    color: Colors.naturalWineRed,
  } as TextStyle,

  accentLarge: {
    fontFamily: FontFamily.accentBold,
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.normal,
    color: Colors.naturalWineRed,
  } as TextStyle,

  // Link Style
  link: {
    fontFamily: FontFamily.uiMedium,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.base * LineHeight.normal,
    letterSpacing: LetterSpacing.normal,
    color: Colors.mondrianBlue,
    textDecorationLine: 'underline' as TextStyle['textDecorationLine'],
  } as TextStyle,
} as const;

export type TextStyleKey = keyof typeof TextStyles;
export type FontFamilyKey = keyof typeof FontFamily;
export type FontSizeKey = keyof typeof FontSize;
