/**
 * Custom Text Component with Letterpress Effect
 * Supports multiple variants following Tipsy aesthetic
 */

import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleSheet,
  TextStyle,
} from 'react-native';
import { TextStyles, TextStyleKey, textLetterpressEffect } from '../../constants/Typography';
import { Colors } from '../../constants/Colors';

export interface CustomTextProps extends RNTextProps {
  /**
   * Text variant - determines the styling
   */
  variant?: TextStyleKey;

  /**
   * Apply letterpress effect
   * @default true for display/heading variants, false for body
   */
  letterpress?: boolean | 'light' | 'dark';

  /**
   * Text color override
   */
  color?: string;

  /**
   * Font weight override
   */
  weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'black';

  /**
   * Font size override
   */
  size?: number;

  /**
   * Text alignment
   */
  align?: 'left' | 'center' | 'right' | 'justify';

  /**
   * Enable 3D shadow effect
   */
  shadow3D?: boolean;

  /**
   * Uppercase transformation
   */
  uppercase?: boolean;

  /**
   * Children content
   */
  children: React.ReactNode;
}

/**
 * Text Component
 *
 * @example
 * // Display text with letterpress
 * <Text variant="display">Tipsy</Text>
 *
 * @example
 * // Body text without letterpress
 * <Text variant="body">Natural wine tracking for enthusiasts</Text>
 *
 * @example
 * // Custom styled text
 * <Text variant="h1" color="#E63946" letterpress="dark">
 *   Welcome
 * </Text>
 */
export const Text: React.FC<CustomTextProps> = ({
  variant = 'body',
  letterpress,
  color,
  weight,
  size,
  align,
  shadow3D = false,
  uppercase = false,
  style,
  children,
  ...props
}) => {
  // Get base style from variant
  const baseStyle = TextStyles[variant] || TextStyles.body;

  // Determine if letterpress should be applied
  const shouldApplyLetterpress = letterpress !== undefined
    ? letterpress !== false
    : ['display', 'displayLarge', 'displayMedium', 'h1', 'h2'].includes(variant);

  // Build custom style
  const customStyle: TextStyle = {
    ...baseStyle,
    ...(color && { color }),
    ...(size && { fontSize: size }),
    ...(align && { textAlign: align }),
    ...(uppercase && { textTransform: 'uppercase' }),
  };

  // Apply letterpress effect
  if (shouldApplyLetterpress) {
    const letterpressMode = typeof letterpress === 'string' ? letterpress : 'dark';
    Object.assign(customStyle, textLetterpressEffect(letterpressMode));
  }

  // Apply 3D shadow
  if (shadow3D) {
    Object.assign(customStyle, {
      textShadowColor: Colors.shadow,
      textShadowOffset: { width: 0, height: 3 },
      textShadowRadius: 6,
    });
  }

  // Apply font weight override
  if (weight) {
    const weights: Record<string, TextStyle['fontWeight']> = {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900',
    };
    customStyle.fontWeight = weights[weight];
  }

  return (
    <RNText
      style={[customStyle, style]}
      {...props}
    >
      {children}
    </RNText>
  );
};

/**
 * Specialized Text Components for convenience
 */

export const DisplayText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="display" {...props} />
);

export const DisplayLargeText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="displayLarge" {...props} />
);

export const DisplayMediumText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="displayMedium" {...props} />
);

export const H1: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="h1" {...props} />
);

export const H2: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="h2" {...props} />
);

export const H3: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="h3" {...props} />
);

export const H4: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="h4" {...props} />
);

export const BodyText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="body" letterpress={false} {...props} />
);

export const BodyLargeText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="bodyLarge" letterpress={false} {...props} />
);

export const BodySmallText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="bodySmall" letterpress={false} {...props} />
);

export const LabelText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="label" letterpress={false} {...props} />
);

export const CaptionText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="caption" letterpress={false} {...props} />
);

export const AccentText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="accent" letterpress={false} {...props} />
);

export const AccentLargeText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="accentLarge" letterpress={false} {...props} />
);

export const LinkText: React.FC<Omit<CustomTextProps, 'variant'>> = (props) => (
  <Text variant="link" letterpress={false} {...props} />
);

export default Text;
