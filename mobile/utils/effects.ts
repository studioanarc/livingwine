/**
 * Visual Effects Utilities - Tipsy Aesthetic
 * Letterpress, 3D shadows, halftone patterns, and organic shapes
 */

import { ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/Colors';

/**
 * Letterpress Shadow Generator
 * Creates a subtle embossed/debossed effect
 */
export const letterpressShadow = (
  mode: 'emboss' | 'deboss' = 'emboss',
  intensity: number = 1
): ViewStyle => {
  const offset = mode === 'emboss' ? 1 : -1;

  return {
    shadowColor: mode === 'emboss'
      ? Colors.letterpressLight
      : Colors.letterpressDark,
    shadowOffset: {
      width: 0,
      height: offset * intensity,
    },
    shadowOpacity: mode === 'emboss' ? 0.8 : 0.15,
    shadowRadius: 0,
    elevation: 0, // Disable Android elevation for precise effect
  };
};

/**
 * Text Letterpress Effect
 * For use with text elements
 */
export const textLetterpressEffect = (
  mode: 'light' | 'dark' = 'light',
  intensity: number = 1
): TextStyle => ({
  textShadowColor: mode === 'light'
    ? Colors.letterpressLight
    : Colors.letterpressDark,
  textShadowOffset: {
    width: 0,
    height: mode === 'light' ? intensity : -intensity
  },
  textShadowRadius: 0,
});

/**
 * 3D Shadow Generator
 * Creates layered shadow for depth and floating effect
 */
export const shadow3D = (
  depth: 'sm' | 'md' | 'lg' | 'xl' = 'md',
  color: string = Colors.shadowDark
): ViewStyle => {
  const depths = {
    sm: { offset: 2, radius: 4, opacity: 0.15 },
    md: { offset: 4, radius: 8, opacity: 0.2 },
    lg: { offset: 6, radius: 12, opacity: 0.25 },
    xl: { offset: 8, radius: 16, opacity: 0.3 },
  };

  const config = depths[depth];

  return {
    shadowColor: color,
    shadowOffset: {
      width: 0,
      height: config.offset,
    },
    shadowOpacity: config.opacity,
    shadowRadius: config.radius,
    elevation: config.offset * 2, // Android elevation
  };
};

/**
 * Organic 3D Button Shadow
 * Special shadow that mimics physical button press
 */
export const organicButtonShadow = (pressed: boolean = false): ViewStyle => {
  if (pressed) {
    return {
      shadowColor: Colors.shadowDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.15,
      shadowRadius: 2,
      elevation: 1,
    };
  }

  return {
    shadowColor: Colors.shadowDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  };
};

/**
 * 3D Text Shadow Effect
 * Creates layered text shadow for depth
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
 * Halftone Pattern Generator
 * Returns style for halftone background overlay
 * Note: Actual pattern requires SVG or image implementation
 */
export interface HalftoneConfig {
  dotSize: number;
  spacing: number;
  color: string;
  opacity: number;
  angle?: number;
}

export const halftonePattern = (
  config: Partial<HalftoneConfig> = {}
): HalftoneConfig => {
  const defaults: HalftoneConfig = {
    dotSize: 3,
    spacing: 8,
    color: Colors.charcoal,
    opacity: 0.1,
    angle: 45,
  };

  return { ...defaults, ...config };
};

/**
 * Generates SVG halftone pattern string
 * Can be used with react-native-svg
 */
export const generateHalftonePatternSVG = (
  width: number,
  height: number,
  config: Partial<HalftoneConfig> = {}
): string => {
  const pattern = halftonePattern(config);
  const { dotSize, spacing, color, opacity } = pattern;

  const rows = Math.ceil(height / spacing);
  const cols = Math.ceil(width / spacing);

  let circles = '';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cx = col * spacing + spacing / 2;
      const cy = row * spacing + spacing / 2;
      circles += `<circle cx="${cx}" cy="${cy}" r="${dotSize}" fill="${color}" opacity="${opacity}" />`;
    }
  }

  return `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      ${circles}
    </svg>
  `;
};

/**
 * Organic Border Radius
 * Creates slightly irregular border radius for organic feel
 */
export const organicBorderRadius = (
  baseRadius: number = 16,
  variation: number = 0.15
): ViewStyle => {
  const vary = (base: number) => {
    const variance = base * variation;
    return base + (Math.random() * variance * 2 - variance);
  };

  return {
    borderTopLeftRadius: vary(baseRadius),
    borderTopRightRadius: vary(baseRadius),
    borderBottomLeftRadius: vary(baseRadius),
    borderBottomRightRadius: vary(baseRadius),
  };
};

/**
 * Slight Rotation Effect
 * Adds subtle rotation to elements for organic, hand-placed feel
 */
export const slightRotation = (
  maxDegrees: number = 2
): ViewStyle => {
  const rotation = (Math.random() * maxDegrees * 2 - maxDegrees);
  return {
    transform: [{ rotate: `${rotation}deg` }],
  };
};

/**
 * Paper Texture Effect
 * Combines subtle shadow and border for paper-like appearance
 */
export const paperTexture = (): ViewStyle => ({
  backgroundColor: Colors.tipsyWhite,
  ...shadow3D('sm', Colors.shadowLight),
  borderWidth: 1,
  borderColor: Colors.lightGray,
});

/**
 * Ink Bleed Effect
 * Subtle blur effect for ink-on-paper aesthetic
 */
export const inkBleedEffect = (intensity: 'subtle' | 'medium' | 'strong' = 'subtle'): ViewStyle => {
  const intensities = {
    subtle: { opacity: 0.05, blur: 1 },
    medium: { opacity: 0.1, blur: 2 },
    strong: { opacity: 0.15, blur: 3 },
  };

  const config = intensities[intensity];

  return {
    shadowColor: Colors.charcoal,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: config.opacity,
    shadowRadius: config.blur,
  };
};

/**
 * Organic Shape Path Generator
 * Generates smooth, organic blob-like shapes using bezier curves
 */
export interface BlobPoint {
  x: number;
  y: number;
}

export const generateBlobPath = (
  centerX: number,
  centerY: number,
  radius: number,
  points: number = 6,
  randomness: number = 0.3
): string => {
  const angleStep = (Math.PI * 2) / points;
  const blobPoints: BlobPoint[] = [];

  // Generate points around the circle with random variation
  for (let i = 0; i < points; i++) {
    const angle = angleStep * i;
    const radiusVariation = radius * (1 + (Math.random() - 0.5) * randomness);

    blobPoints.push({
      x: centerX + Math.cos(angle) * radiusVariation,
      y: centerY + Math.sin(angle) * radiusVariation,
    });
  }

  // Create smooth bezier curve path
  let path = `M ${blobPoints[0].x},${blobPoints[0].y}`;

  for (let i = 0; i < points; i++) {
    const current = blobPoints[i];
    const next = blobPoints[(i + 1) % points];
    const nextNext = blobPoints[(i + 2) % points];

    // Calculate control points for smooth curve
    const cp1x = current.x + (next.x - current.x) * 0.5;
    const cp1y = current.y + (next.y - current.y) * 0.5;
    const cp2x = next.x - (nextNext.x - current.x) * 0.15;
    const cp2y = next.y - (nextNext.y - current.y) * 0.15;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }

  path += ' Z';
  return path;
};

/**
 * Preset Organic Shapes
 */
export const organicShapes = {
  blob1: (size: number) => generateBlobPath(size / 2, size / 2, size / 2, 6, 0.3),
  blob2: (size: number) => generateBlobPath(size / 2, size / 2, size / 2, 8, 0.25),
  blob3: (size: number) => generateBlobPath(size / 2, size / 2, size / 2, 5, 0.4),
  cloud: (size: number) => generateBlobPath(size / 2, size / 2, size / 2, 7, 0.35),
};

/**
 * Gradient Overlay Effect
 * Creates subtle gradient overlay for depth
 */
export const gradientOverlay = (
  colors: string[],
  angle: number = 180
): { colors: string[]; angle: number } => ({
  colors,
  angle,
});

/**
 * Noise Texture Generator
 * Returns configuration for noise texture overlay
 */
export interface NoiseConfig {
  opacity: number;
  scale: number;
  blend: 'multiply' | 'overlay' | 'screen';
}

export const noiseTexture = (
  intensity: 'subtle' | 'medium' | 'strong' = 'subtle'
): NoiseConfig => {
  const configs = {
    subtle: { opacity: 0.03, scale: 1, blend: 'multiply' as const },
    medium: { opacity: 0.06, scale: 1.5, blend: 'overlay' as const },
    strong: { opacity: 0.1, scale: 2, blend: 'overlay' as const },
  };

  return configs[intensity];
};

/**
 * Combined Card Effect
 * Combines multiple effects for a cohesive card design
 */
export const cardEffect = (
  variant: 'flat' | 'raised' | 'floating' = 'raised'
): ViewStyle => {
  const variants = {
    flat: {
      ...paperTexture(),
    },
    raised: {
      ...paperTexture(),
      ...shadow3D('md'),
    },
    floating: {
      ...paperTexture(),
      ...shadow3D('lg'),
    },
  };

  return variants[variant];
};
