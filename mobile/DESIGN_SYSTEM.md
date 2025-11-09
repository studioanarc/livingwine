# Tipsy - Design System Documentation

Complete design system for the Natural Wine Tracking mobile app, following the **Tipsy Aesthetic**.

## Overview

This design system provides a cohesive visual language inspired by natural wine culture: organic, authentic, handcrafted, and unpretentious.

### Key Characteristics
- **Letterpress effects** on typography for tactile, printed feel
- **Organic shapes** with irregular borders and subtle rotations
- **3D shadows** for depth and physicality
- **Warm color palette** inspired by wine, paper, and earth
- **Playful but sophisticated** typography hierarchy

---

## 📁 File Structure

```
mobile/
├── constants/
│   ├── Colors.ts           # Color palette & semantic colors
│   └── Typography.ts       # Font families, sizes, text styles
├── utils/
│   └── effects.ts          # Visual effects utilities
├── components/
│   └── design-system/
│       ├── Text.tsx        # Custom text component
│       ├── Button.tsx      # Button with 3D shadows
│       ├── Card.tsx        # Card with organic borders
│       ├── BlobShape.tsx   # SVG blob backgrounds
│       └── index.ts        # Centralized exports
├── assets/
│   └── fonts/              # Custom font files
└── app/
    └── _layout.tsx         # Font loading setup
```

---

## 🎨 Colors

### Color Palette

```typescript
import { Colors, SemanticColors } from '@/constants/Colors';

// Primary Colors
Colors.cream          // #FCF8F2 - Main background
Colors.warmBeige      // #F3E4DB - Secondary background
Colors.terracotta     // #E8B4A0 - Accent

// Mondrian-inspired Accents
Colors.mondrianBlue   // #4A90E2 - Vibrant blue
Colors.mondrianRed    // #E63946 - Bold red
Colors.mondrianYellow // #F4D35E - Sunny yellow

// Natural Wine Colors
Colors.naturalWineRed // #8B3A3A - Deep wine
Colors.orangeWine     // #E67E22 - Orange/amber
Colors.pinkWine       // #E9A6A6 - Rosé

// Earth Tones
Colors.oliveGreen     // #7C9473 - Organic certification
Colors.clayBrown      // #A67C52 - Warm clay
Colors.grapePurple    // #6B5B95 - Muted grape
```

### Semantic Colors

```typescript
// Use semantic colors for consistent theming
SemanticColors.background.primary   // Main background
SemanticColors.text.primary         // Primary text
SemanticColors.button.primary       // Primary button colors
SemanticColors.wine.red             // Wine type colors
```

### Gradients

```typescript
import { Gradients } from '@/constants/Colors';

Gradients.sunset  // ['#E8B4A0', '#E67E22', '#8B3A3A']
Gradients.earth   // ['#F3E4DB', '#A67C52', '#7C9473']
Gradients.wine    // ['#E9A6A6', '#8B3A3A', '#6B5B95']
```

---

## 📝 Typography

### Font Families

```typescript
import { FontFamily } from '@/constants/Typography';

FontFamily.display      // Fraunces - Display text
FontFamily.displayBold  // Fraunces Bold
FontFamily.displayBlack // Fraunces Black

FontFamily.body         // Cabinet Grotesk - Body text
FontFamily.bodyMedium   // Cabinet Grotesk Medium
FontFamily.bodyBold     // Cabinet Grotesk Bold

FontFamily.ui           // Inter - UI elements
FontFamily.uiSemiBold   // Inter SemiBold
FontFamily.uiBold       // Inter Bold

FontFamily.accent       // Caveat - Handwritten accents
FontFamily.accentBold   // Caveat Bold
```

### Text Styles

```typescript
import { TextStyles } from '@/constants/Typography';

// Display styles (with letterpress)
TextStyles.displayLarge    // 60px, Fraunces Black
TextStyles.display         // 48px, Fraunces Black
TextStyles.displayMedium   // 36px, Fraunces Bold

// Heading styles
TextStyles.h1              // 30px, Fraunces Bold
TextStyles.h2              // 24px, Fraunces Bold
TextStyles.h3              // 20px, Cabinet Grotesk Bold
TextStyles.h4              // 18px, Cabinet Grotesk Bold

// Body styles
TextStyles.bodyLarge       // 18px, Cabinet Grotesk
TextStyles.body            // 16px, Cabinet Grotesk
TextStyles.bodySmall       // 14px, Cabinet Grotesk

// UI styles
TextStyles.button          // 16px, Inter Bold, uppercase
TextStyles.label           // 14px, Inter SemiBold, uppercase
TextStyles.caption         // 12px, Inter

// Accent styles
TextStyles.accentLarge     // 24px, Caveat Bold
TextStyles.accent          // 20px, Caveat
```

---

## 🔤 Text Component

### Basic Usage

```typescript
import { Text, H1, BodyText } from '@/components/design-system';

// Display text with automatic letterpress
<Text variant="display">Tipsy</Text>

// Heading
<H1>Natural Wine Tracker</H1>

// Body text
<BodyText>Discover organic wines from around the world.</BodyText>
```

### Advanced Usage

```typescript
// Custom color and size
<Text
  variant="h2"
  color="#E63946"
  letterpress="dark"
>
  Featured Wines
</Text>

// 3D shadow effect
<Text
  variant="display"
  shadow3D
  color={Colors.naturalWineRed}
>
  Check In
</Text>

// Uppercase with custom alignment
<Text
  variant="body"
  uppercase
  align="center"
>
  Discover
</Text>
```

### Specialized Components

```typescript
<DisplayText>Hero Text</DisplayText>
<H1>Heading 1</H1>
<H2>Heading 2</H2>
<BodyText>Body text</BodyText>
<LabelText>Label</LabelText>
<AccentText>Handwritten accent</AccentText>
<LinkText>Clickable link</LinkText>
```

---

## 🔘 Button Component

### Basic Usage

```typescript
import { Button } from '@/components/design-system';

// Primary button
<Button onPress={() => console.log('Pressed')}>
  Check In
</Button>

// Secondary button
<Button variant="secondary">
  Discover Wines
</Button>

// Accent button
<Button variant="accent">
  Join Tasting
</Button>
```

### Variants

```typescript
// Primary - Wine red background
<Button variant="primary">Primary</Button>

// Secondary - Blue background
<Button variant="secondary">Secondary</Button>

// Accent - Orange background
<Button variant="accent">Accent</Button>

// Ghost - Transparent background
<Button variant="ghost">Ghost</Button>

// Outline - Border only
<Button variant="outline">Outline</Button>
```

### Sizes

```typescript
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>
```

### Advanced Features

```typescript
// Full width button
<Button fullWidth>Full Width</Button>

// With icons
<Button
  leftIcon={<Icon name="wine" />}
  rightIcon={<Icon name="arrow-right" />}
>
  Explore
</Button>

// Loading state
<Button loading>Loading...</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Regular radius (no organic variation)
<Button regularRadius>Regular</Button>
```

### Specialized Buttons

```typescript
import {
  PrimaryButton,
  SecondaryButton,
  AccentButton
} from '@/components/design-system';

<PrimaryButton onPress={handlePress}>Primary</PrimaryButton>
<SecondaryButton onPress={handlePress}>Secondary</SecondaryButton>
<AccentButton onPress={handlePress}>Accent</AccentButton>
```

---

## 🃏 Card Component

### Basic Usage

```typescript
import { Card } from '@/components/design-system';

<Card>
  <Text variant="h3">Wine Name</Text>
  <BodyText>Producer details...</BodyText>
</Card>
```

### Variants

```typescript
// Flat - Minimal shadow
<Card variant="flat">
  Content
</Card>

// Raised - Medium shadow (default)
<Card variant="raised">
  Content
</Card>

// Floating - Large shadow
<Card variant="floating">
  Content
</Card>
```

### Advanced Features

```typescript
// With halftone pattern
<Card halftone>
  Premium content
</Card>

// Custom background color
<Card backgroundColor={Colors.warmBeige}>
  Custom background
</Card>

// Pressable card
<Card onPress={() => console.log('Pressed')}>
  Tap me
</Card>

// No rotation
<Card rotate={false}>
  Stable card
</Card>

// Regular radius
<Card organicRadius={false} radius={20}>
  Regular borders
</Card>

// With border
<Card
  bordered
  borderColor={Colors.mondrianBlue}
  borderWidth={2}
>
  Bordered card
</Card>
```

### Specialized Cards

```typescript
import {
  WineCheckInCard,
  ProducerCard,
  EventCard
} from '@/components/design-system';

// Wine check-in with decorative stain
<WineCheckInCard wineStain wineColor={Colors.naturalWineRed}>
  Wine details
</WineCheckInCard>

// Producer card with certification badge
<ProducerCard certified>
  Producer info
</ProducerCard>

// Event card with blue border
<EventCard>
  Event details
</EventCard>
```

---

## 🫧 Blob Shape Component

### Basic Usage

```typescript
import { BlobShape } from '@/components/design-system';

// Simple blob
<BlobShape
  size={200}
  color={Colors.warmBeige}
/>
```

### With Gradient

```typescript
import { Gradients } from '@/constants/Colors';

<BlobShape
  size={250}
  gradient={Gradients.sunset}
  gradientAngle={135}
/>
```

### Presets

```typescript
<BlobShape preset="blob1" size={200} />
<BlobShape preset="wine" size={150} />
<BlobShape preset="cloud" size={180} />
<BlobShape preset="grape" size={160} />
```

### Advanced Options

```typescript
<BlobShape
  size={300}
  color={Colors.mondrianBlue}
  opacity={0.2}
  rotation={45}
  points={8}              // More points = smoother blob
  randomness={0.4}        // Higher = more irregular
  halftone                // Add halftone dots
/>
```

### Specialized Blob Components

```typescript
import {
  BackgroundBlob,
  WineStainBlob,
  HeaderBlob,
  IconBlobBackground
} from '@/components/design-system';

// Background decoration
<BackgroundBlob
  position="top-right"
  size={300}
  color={Colors.warmBeige}
  opacity={0.3}
/>

// Wine stain effect
<WineStainBlob size={100} />

// Header decoration
<HeaderBlob gradient={Gradients.sunset} />

// Icon background
<View>
  <IconBlobBackground color={Colors.mondrianBlue} />
  <Icon name="wine" />
</View>
```

---

## ✨ Visual Effects

### Letterpress Effect

```typescript
import { letterpressShadow, textLetterpressEffect } from '@/utils/effects';

// For views
const viewStyle = {
  ...letterpressShadow('emboss', 1),
};

// For text
const textStyle = {
  ...textLetterpressEffect('dark', 1),
};
```

### 3D Shadow

```typescript
import { shadow3D, organicButtonShadow } from '@/utils/effects';

// Standard 3D shadow
const cardStyle = {
  ...shadow3D('md'),  // 'sm' | 'md' | 'lg' | 'xl'
};

// Button shadow (changes on press)
const buttonStyle = {
  ...organicButtonShadow(pressed),
};
```

### Organic Shapes

```typescript
import {
  organicBorderRadius,
  slightRotation
} from '@/utils/effects';

// Organic border radius
const cardStyle = {
  ...organicBorderRadius(16, 0.15),
};

// Slight rotation
const elementStyle = {
  ...slightRotation(2),  // Max degrees
};
```

### Halftone Pattern

```typescript
import {
  halftonePattern,
  generateHalftonePatternSVG
} from '@/utils/effects';

// Get halftone configuration
const config = halftonePattern({
  dotSize: 3,
  spacing: 8,
  color: Colors.charcoal,
  opacity: 0.1,
});

// Generate SVG pattern
const svgPattern = generateHalftonePatternSVG(200, 200, config);
```

### Combined Effects

```typescript
import { cardEffect, paperTexture } from '@/utils/effects';

// Card effect (combines multiple effects)
const cardStyle = {
  ...cardEffect('raised'),  // 'flat' | 'raised' | 'floating'
};

// Paper texture
const paperStyle = {
  ...paperTexture(),
};
```

---

## 📱 Usage Examples

### Wine Check-in Screen

```typescript
import {
  Text,
  H1,
  BodyText,
  Button,
  Card,
  WineCheckInCard,
  BackgroundBlob
} from '@/components/design-system';
import { Colors, Gradients } from '@/constants/Colors';

export default function CheckInScreen() {
  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <BackgroundBlob
        position="top-right"
        gradient={Gradients.sunset}
        size={300}
        opacity={0.2}
      />

      {/* Header */}
      <H1>Wine Check-in</H1>

      {/* Wine card */}
      <WineCheckInCard
        wineStain
        wineColor={Colors.naturalWineRed}
        onPress={handleWinePress}
      >
        <Text variant="h3">Domaine Rietsch</Text>
        <BodyText>Orange Wine • Alsace</BodyText>
      </WineCheckInCard>

      {/* Action buttons */}
      <Button
        variant="primary"
        fullWidth
        leftIcon={<Icon name="wine" />}
      >
        Add Tasting Notes
      </Button>

      <Button variant="secondary" fullWidth>
        Share Check-in
      </Button>
    </View>
  );
}
```

### Producer Profile

```typescript
import {
  H1,
  H2,
  BodyText,
  ProducerCard,
  HeaderBlob
} from '@/components/design-system';

export default function ProducerScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header blob */}
      <HeaderBlob gradient={Gradients.earth} />

      <H1>Domaine Rietsch</H1>

      <ProducerCard certified>
        <H2>About</H2>
        <BodyText>
          Family-run biodynamic vineyard in Alsace...
        </BodyText>
      </ProducerCard>

      <Card variant="floating">
        <H2>Farming Methods</H2>
        <BodyText>
          • Certified Biodynamic (Demeter){'\n'}
          • Hand-harvested{'\n'}
          • Minimal intervention
        </BodyText>
      </Card>
    </ScrollView>
  );
}
```

---

## 🎭 Design Principles

### 1. Organic & Authentic
- Irregular shapes and slight rotations
- Warm, earthy color palette
- Handwritten accents for personality

### 2. Tactile & Physical
- Letterpress effects on text
- 3D shadows for depth
- Paper-like textures

### 3. Playful but Sophisticated
- Bold Mondrian-inspired accent colors
- Whimsical blob shapes
- Professional typography hierarchy

### 4. Natural Wine Values
- Unfiltered = tipsy aesthetic (halftone patterns)
- Organic = earth tones and olive greens
- Authentic = handcrafted feel

---

## 📦 Dependencies

Required packages:

```json
{
  "expo-font": "latest",
  "react-native-svg": "latest",
  "expo-router": "latest"
}
```

Install with:

```bash
npx expo install expo-font react-native-svg
```

---

## 🚀 Getting Started

1. **Download fonts** (see `/mobile/assets/fonts/README.md`)
2. **Install dependencies**
3. **Import design system components**
4. **Start building!**

```typescript
import {
  Text,
  Button,
  Card,
  BlobShape,
  Colors
} from '@/components/design-system';
```

---

## 🎨 Customization

### Extend Colors

```typescript
// In your component or screen
const customColors = {
  ...Colors,
  brandPrimary: '#custom-color',
};
```

### Create Custom Text Styles

```typescript
import { TextStyles, FontFamily } from '@/constants/Typography';

const customTextStyle = {
  ...TextStyles.body,
  fontSize: 20,
  color: Colors.mondrianBlue,
};
```

### Custom Button Variants

```typescript
<Button
  style={{ backgroundColor: Colors.grapePurple }}
  textColor={Colors.offWhite}
>
  Custom Button
</Button>
```

---

## 📝 Best Practices

1. **Use semantic colors** instead of raw color values
2. **Prefer Text component** over React Native's Text
3. **Leverage specialized components** (WineCheckInCard, ProducerCard, etc.)
4. **Add blob decorations** sparingly for visual interest
5. **Combine effects** thoughtfully to avoid over-styling
6. **Test on both iOS and Android** for font rendering
7. **Use organic shapes** for cards and important elements
8. **Apply letterpress** to headings and display text only

---

## 🐛 Troubleshooting

### Fonts not loading
- Check font file paths in `_layout.tsx`
- Clear cache: `expo start -c`
- Verify font files are in `/mobile/assets/fonts/`

### SVG not rendering
- Install `react-native-svg`: `npx expo install react-native-svg`
- Check SVG imports

### Shadows not appearing on Android
- Use `elevation` property (automatically applied in shadow3D)
- Ensure backgroundColor is set on the component

---

## 📄 License

Design system created for Tipsy - Natural Wine Tracking App

Fonts licenses:
- Fraunces: SIL Open Font License
- Plus Jakarta Sans: SIL Open Font License
- Inter: SIL Open Font License
- Caveat: SIL Open Font License
