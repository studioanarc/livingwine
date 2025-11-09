/**
 * SVG Blob Shape Component
 * Generates organic, blob-like shapes for backgrounds and decorations
 */

import React, { useMemo } from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Circle } from 'react-native-svg';
import { generateBlobPath } from '../../utils/effects';
import { Colors, Gradients } from '../../constants/Colors';

export interface BlobShapeProps {
  /**
   * Size of the blob (width and height)
   * @default 200
   */
  size?: number;

  /**
   * Fill color
   * @default Colors.warmBeige
   */
  color?: string;

  /**
   * Use gradient instead of solid color
   */
  gradient?: string[];

  /**
   * Gradient direction angle (degrees)
   * @default 135
   */
  gradientAngle?: number;

  /**
   * Number of points for blob shape
   * @default 6
   */
  points?: number;

  /**
   * Randomness factor (0-1)
   * @default 0.3
   */
  randomness?: number;

  /**
   * Opacity
   * @default 1
   */
  opacity?: number;

  /**
   * Rotation angle in degrees
   * @default 0
   */
  rotation?: number;

  /**
   * Container style
   */
  style?: ViewStyle;

  /**
   * Preset blob shape
   */
  preset?: 'blob1' | 'blob2' | 'blob3' | 'cloud' | 'wine' | 'grape';

  /**
   * Add halftone dots overlay
   * @default false
   */
  halftone?: boolean;
}

/**
 * BlobShape Component
 *
 * @example
 * // Simple blob
 * <BlobShape size={150} color={Colors.mondrianBlue} />
 *
 * @example
 * // Blob with gradient
 * <BlobShape
 *   size={200}
 *   gradient={Gradients.sunset}
 *   preset="wine"
 * />
 *
 * @example
 * // Background decoration blob
 * <BlobShape
 *   size={300}
 *   color={Colors.warmBeige}
 *   opacity={0.3}
 *   rotation={45}
 *   style={{ position: 'absolute', top: -50, right: -50 }}
 * />
 */
export const BlobShape: React.FC<BlobShapeProps> = ({
  size = 200,
  color = Colors.warmBeige,
  gradient,
  gradientAngle = 135,
  points = 6,
  randomness = 0.3,
  opacity = 1,
  rotation = 0,
  style,
  preset,
  halftone = false,
}) => {
  // Generate blob path
  const blobPath = useMemo(() => {
    if (preset) {
      return getPresetBlobPath(preset, size);
    }
    return generateBlobPath(size / 2, size / 2, size / 2, points, randomness);
  }, [size, points, randomness, preset]);

  // Calculate gradient coordinates based on angle
  const getGradientCoords = (angle: number) => {
    const rad = (angle * Math.PI) / 180;
    return {
      x1: '50%',
      y1: '0%',
      x2: `${50 + 50 * Math.cos(rad)}%`,
      y2: `${50 + 50 * Math.sin(rad)}%`,
    };
  };

  const gradientCoords = getGradientCoords(gradientAngle);

  return (
    <View style={[styles.container, style]}>
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: [{ rotate: `${rotation}deg` }] }}
      >
        <Defs>
          {gradient && (
            <LinearGradient
              id="blobGradient"
              x1={gradientCoords.x1}
              y1={gradientCoords.y1}
              x2={gradientCoords.x2}
              y2={gradientCoords.y2}
            >
              {gradient.map((color, index) => (
                <Stop
                  key={index}
                  offset={`${(index / (gradient.length - 1)) * 100}%`}
                  stopColor={color}
                  stopOpacity={opacity}
                />
              ))}
            </LinearGradient>
          )}
        </Defs>

        {/* Main blob path */}
        <Path
          d={blobPath}
          fill={gradient ? 'url(#blobGradient)' : color}
          opacity={gradient ? 1 : opacity}
        />

        {/* Halftone overlay */}
        {halftone && <HalftoneOverlay size={size} />}
      </Svg>
    </View>
  );
};

/**
 * Halftone Overlay for Blob
 */
const HalftoneOverlay: React.FC<{ size: number }> = ({ size }) => {
  const dotSize = 2;
  const spacing = 8;
  const rows = Math.ceil(size / spacing);
  const cols = Math.ceil(size / spacing);

  const dots = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * spacing + spacing / 2;
      const cy = row * spacing + spacing / 2;
      dots.push(
        <Circle
          key={`${row}-${col}`}
          cx={cx}
          cy={cy}
          r={dotSize}
          fill={Colors.charcoal}
          opacity={0.1}
        />
      );
    }
  }

  return <>{dots}</>;
};

/**
 * Get preset blob paths
 */
const getPresetBlobPath = (preset: string, size: number): string => {
  const center = size / 2;
  const radius = size / 2;

  switch (preset) {
    case 'blob1':
      return generateBlobPath(center, center, radius, 6, 0.3);
    case 'blob2':
      return generateBlobPath(center, center, radius, 8, 0.25);
    case 'blob3':
      return generateBlobPath(center, center, radius, 5, 0.4);
    case 'cloud':
      return generateBlobPath(center, center, radius, 7, 0.35);
    case 'wine':
      // Wine glass inspired shape
      return generateBlobPath(center, center, radius * 0.8, 5, 0.45);
    case 'grape':
      // Grape cluster inspired
      return generateBlobPath(center, center, radius, 8, 0.2);
    default:
      return generateBlobPath(center, center, radius, 6, 0.3);
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * Specialized Blob Components
 */

export const BackgroundBlob: React.FC<Omit<BlobShapeProps, 'style'> & {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}> = ({ position, size = 300, opacity = 0.3, ...props }) => {
  const positions: Record<string, ViewStyle> = {
    'top-left': {
      position: 'absolute',
      top: -size / 3,
      left: -size / 3,
    },
    'top-right': {
      position: 'absolute',
      top: -size / 3,
      right: -size / 3,
    },
    'bottom-left': {
      position: 'absolute',
      bottom: -size / 3,
      left: -size / 3,
    },
    'bottom-right': {
      position: 'absolute',
      bottom: -size / 3,
      right: -size / 3,
    },
    'center': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [
        { translateX: -size / 2 },
        { translateY: -size / 2 },
      ],
    },
  };

  return (
    <BlobShape
      size={size}
      opacity={opacity}
      style={positions[position]}
      {...props}
    />
  );
};

/**
 * Wine Stain Blob
 * Decorative wine stain effect
 */
export const WineStainBlob: React.FC<Omit<BlobShapeProps, 'color' | 'preset'>> = (
  props
) => (
  <BlobShape
    preset="wine"
    gradient={Gradients.wine}
    opacity={0.15}
    {...props}
  />
);

/**
 * Decorative Header Blob
 * Large blob for page headers
 */
export const HeaderBlob: React.FC<Omit<BlobShapeProps, 'size' | 'style'>> = (
  props
) => (
  <BlobShape
    size={400}
    style={{
      position: 'absolute',
      top: -200,
      right: -100,
      zIndex: -1,
    }}
    opacity={0.2}
    {...props}
  />
);

/**
 * Icon Blob Background
 * Small blob for icon backgrounds
 */
export const IconBlobBackground: React.FC<Omit<BlobShapeProps, 'size'>> = ({
  color = Colors.mondrianBlue,
  opacity = 0.2,
  ...props
}) => (
  <BlobShape
    size={80}
    color={color}
    opacity={opacity}
    preset="cloud"
    {...props}
  />
);

/**
 * Animated Blob (placeholder for future animation)
 * This would use react-native-reanimated for smooth animations
 */
export const AnimatedBlob: React.FC<BlobShapeProps> = (props) => {
  // TODO: Implement animation with react-native-reanimated
  // Could animate: size, rotation, path morphing
  return <BlobShape {...props} />;
};

export default BlobShape;
