/**
 * Custom Button Component with Organic Shapes
 * 3D shadow effect and multiple variants following Tipsy aesthetic
 */

import React, { useState } from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { Text } from './Text';
import { Colors, SemanticColors } from '../../constants/Colors';
import { organicButtonShadow, organicBorderRadius } from '../../utils/effects';
import { FontFamily } from '../../constants/Typography';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  /**
   * Button variant
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';

  /**
   * Button size
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';

  /**
   * Button text
   */
  children: string | React.ReactNode;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Disable organic border radius
   * @default false
   */
  regularRadius?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Icon to display before text
   */
  leftIcon?: React.ReactNode;

  /**
   * Icon to display after text
   */
  rightIcon?: React.ReactNode;

  /**
   * Custom style
   */
  style?: ViewStyle;

  /**
   * Custom text color
   */
  textColor?: string;
}

/**
 * Button Component
 *
 * @example
 * // Primary button
 * <Button onPress={() => console.log('Pressed')}>
 *   Check In
 * </Button>
 *
 * @example
 * // Secondary button with icon
 * <Button variant="secondary" leftIcon={<Icon name="search" />}>
 *   Discover
 * </Button>
 *
 * @example
 * // Ghost button
 * <Button variant="ghost" size="small">
 *   Cancel
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  children,
  fullWidth = false,
  regularRadius = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textColor,
  onPress,
  ...props
}) => {
  const [pressed, setPressed] = useState(false);

  // Size configurations
  const sizeStyles = {
    small: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      fontSize: 14,
      iconSize: 16,
    },
    medium: {
      paddingVertical: 14,
      paddingHorizontal: 24,
      fontSize: 16,
      iconSize: 20,
    },
    large: {
      paddingVertical: 18,
      paddingHorizontal: 32,
      fontSize: 18,
      iconSize: 24,
    },
  };

  const sizeConfig = sizeStyles[size];

  // Variant configurations
  const variantStyles: Record<string, ViewStyle & { textColor: string }> = {
    primary: {
      backgroundColor: SemanticColors.button.primary.background,
      textColor: textColor || SemanticColors.button.primary.text,
      borderWidth: 0,
    },
    secondary: {
      backgroundColor: SemanticColors.button.secondary.background,
      textColor: textColor || SemanticColors.button.secondary.text,
      borderWidth: 0,
    },
    accent: {
      backgroundColor: SemanticColors.button.accent.background,
      textColor: textColor || SemanticColors.button.accent.text,
      borderWidth: 0,
    },
    ghost: {
      backgroundColor: 'transparent',
      textColor: textColor || SemanticColors.button.ghost.text,
      borderWidth: 0,
    },
    outline: {
      backgroundColor: 'transparent',
      textColor: textColor || SemanticColors.text.primary,
      borderWidth: 2,
      borderColor: SemanticColors.border.medium,
    },
  };

  const variantConfig = variantStyles[variant];

  // Disabled styles
  const disabledStyle: ViewStyle = disabled
    ? {
        opacity: 0.5,
      }
    : {};

  // Build button style
  const buttonStyle: ViewStyle[] = [
    styles.base,
    {
      paddingVertical: sizeConfig.paddingVertical,
      paddingHorizontal: sizeConfig.paddingHorizontal,
    },
    variantConfig,
    fullWidth && styles.fullWidth,
    regularRadius
      ? { borderRadius: 12 }
      : organicBorderRadius(12, 0.2),
    !disabled && variant !== 'ghost' && organicButtonShadow(pressed),
    disabledStyle,
    style,
  ];

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variantConfig.textColor}
          size={size === 'small' ? 'small' : 'large'}
        />
      );
    }

    return (
      <View style={styles.content}>
        {leftIcon && (
          <View style={[styles.icon, styles.leftIcon]}>
            {leftIcon}
          </View>
        )}
        {typeof children === 'string' ? (
          <Text
            variant="button"
            color={variantConfig.textColor}
            size={sizeConfig.fontSize}
            style={styles.text}
          >
            {children}
          </Text>
        ) : (
          children
        )}
        {rightIcon && (
          <View style={[styles.icon, styles.rightIcon]}>
            {rightIcon}
          </View>
        )}
      </View>
    );
  };

  return (
    <Pressable
      style={buttonStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      {...props}
    >
      {renderContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

/**
 * Specialized Button Components
 */

export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="primary" {...props} />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="secondary" {...props} />
);

export const AccentButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="accent" {...props} />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="ghost" {...props} />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button variant="outline" {...props} />
);

export default Button;
