/**
 * Custom Card Component with Organic Shapes
 * Slight rotation, organic border radius, and halftone background option
 */

import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
  ViewStyle,
  Pressable,
  PressableProps,
} from 'react-native';
import { Colors } from '../../constants/Colors';
import {
  shadow3D,
  organicBorderRadius,
  slightRotation,
  paperTexture,
  cardEffect,
} from '../../utils/effects';

export interface CardProps extends ViewProps {
  /**
   * Card variant
   * @default 'raised'
   */
  variant?: 'flat' | 'raised' | 'floating';

  /**
   * Apply slight rotation for organic feel
   * @default true
   */
  rotate?: boolean;

  /**
   * Apply organic border radius
   * @default true
   */
  organicRadius?: boolean;

  /**
   * Border radius value (if not using organic)
   * @default 16
   */
  radius?: number;

  /**
   * Show halftone pattern background
   * @default false
   */
  halftone?: boolean;

  /**
   * Background color
   */
  backgroundColor?: string;

  /**
   * Padding inside card
   * @default 16
   */
  padding?: number;

  /**
   * Make card pressable
   */
  onPress?: () => void;

  /**
   * Show border
   * @default false
   */
  bordered?: boolean;

  /**
   * Border color
   */
  borderColor?: string;

  /**
   * Border width
   */
  borderWidth?: number;

  /**
   * Children content
   */
  children: React.ReactNode;
}

/**
 * Card Component
 *
 * @example
 * // Basic card
 * <Card>
 *   <Text>Card content</Text>
 * </Card>
 *
 * @example
 * // Floating card with halftone
 * <Card variant="floating" halftone>
 *   <Text>Premium content</Text>
 * </Card>
 *
 * @example
 * // Pressable card without rotation
 * <Card
 *   onPress={() => console.log('Pressed')}
 *   rotate={false}
 * >
 *   <Text>Tap me</Text>
 * </Card>
 */
export const Card: React.FC<CardProps> = ({
  variant = 'raised',
  rotate = true,
  organicRadius = true,
  radius = 16,
  halftone = false,
  backgroundColor,
  padding = 16,
  onPress,
  bordered = false,
  borderColor,
  borderWidth = 1,
  style,
  children,
  ...props
}) => {
  // Build card style
  const cardStyle: ViewStyle[] = [
    styles.base,
    cardEffect(variant),
    organicRadius
      ? organicBorderRadius(radius, 0.15)
      : { borderRadius: radius },
    rotate && slightRotation(1.5),
    backgroundColor && { backgroundColor },
    padding !== undefined && { padding },
    bordered && {
      borderWidth,
      borderColor: borderColor || Colors.lightGray,
    },
    style,
  ];

  // Render card content
  const renderContent = () => (
    <View style={cardStyle} {...props}>
      {halftone && <HalftoneOverlay />}
      {children}
    </View>
  );

  // If pressable, wrap in Pressable
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={styles.pressableContainer}>
        {renderContent()}
      </Pressable>
    );
  }

  return renderContent();
};

/**
 * Halftone Overlay Component
 * Displays halftone pattern over card background
 */
const HalftoneOverlay: React.FC = () => (
  <View style={styles.halftoneOverlay} pointerEvents="none">
    {/* This is a placeholder - actual implementation would use SVG */}
    <View style={styles.halftonePattern} />
  </View>
);

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
  pressableContainer: {
    // Allow pressable to not affect layout
  },
  halftoneOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    opacity: 0.1,
  },
  halftonePattern: {
    flex: 1,
    // Placeholder for actual halftone pattern
    // In production, this would be rendered using react-native-svg
  },
});

/**
 * Specialized Card Components
 */

export const FlatCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="flat" {...props} />
);

export const RaisedCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="raised" {...props} />
);

export const FloatingCard: React.FC<Omit<CardProps, 'variant'>> = (props) => (
  <Card variant="floating" {...props} />
);

/**
 * Wine Check-in Card
 * Specialized card for wine check-ins
 */
export interface WineCheckInCardProps extends Omit<CardProps, 'variant'> {
  /**
   * Show wine stain decoration
   * @default false
   */
  wineStain?: boolean;

  /**
   * Wine color for stain
   */
  wineColor?: string;
}

export const WineCheckInCard: React.FC<WineCheckInCardProps> = ({
  wineStain = false,
  wineColor = Colors.naturalWineRed,
  children,
  ...props
}) => {
  return (
    <Card variant="raised" {...props}>
      {wineStain && (
        <View style={[styles.wineStain, { backgroundColor: wineColor }]} />
      )}
      {children}
    </Card>
  );
};

/**
 * Producer Card
 * Specialized card for producer profiles
 */
export interface ProducerCardProps extends Omit<CardProps, 'variant'> {
  /**
   * Show organic certification badge
   */
  certified?: boolean;
}

export const ProducerCard: React.FC<ProducerCardProps> = ({
  certified = false,
  children,
  ...props
}) => {
  return (
    <Card variant="raised" backgroundColor={Colors.warmBeige} {...props}>
      {certified && (
        <View style={styles.certificationBadge}>
          <View style={styles.certificationDot} />
        </View>
      )}
      {children}
    </Card>
  );
};

/**
 * Event Card
 * Specialized card for events and tastings
 */
export const EventCard: React.FC<CardProps> = (props) => (
  <Card
    variant="floating"
    backgroundColor={Colors.cloudyWhite}
    bordered
    borderColor={Colors.mondrianBlue}
    borderWidth={2}
    {...props}
  />
);

/**
 * Quote Card
 * Card for displaying quotes or testimonials
 */
export const QuoteCard: React.FC<CardProps> = (props) => (
  <Card
    variant="flat"
    backgroundColor={Colors.warmBeige}
    organicRadius
    rotate
    {...props}
  />
);

// Additional styles for specialized cards
StyleSheet.create({
  wineStain: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.15,
  },
  certificationBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.oliveGreen,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  certificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.offWhite,
  },
});

export default Card;
