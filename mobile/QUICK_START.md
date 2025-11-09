# Tipsy Design System - Quick Start Guide

Get up and running with the Tipsy aesthetic design system in 5 minutes.

## Step 1: Install Dependencies

```bash
cd /home/user/livingwine/mobile
npx expo install expo-font react-native-svg
```

## Step 2: Download Fonts

Download the required font files and place them in `/mobile/assets/fonts/`:

### Required Fonts:

1. **Fraunces** - https://fonts.google.com/specimen/Fraunces
   - Fraunces-Regular.ttf
   - Fraunces-Bold.ttf
   - Fraunces-Black.ttf

2. **Plus Jakarta Sans** - https://fonts.google.com/specimen/Plus+Jakarta+Sans
   - PlusJakartaSans-Regular.ttf
   - PlusJakartaSans-Medium.ttf
   - PlusJakartaSans-Bold.ttf

3. **Inter** - https://fonts.google.com/specimen/Inter
   - Inter-Regular.ttf
   - Inter-Medium.ttf
   - Inter-SemiBold.ttf
   - Inter-Bold.ttf

4. **Caveat** - https://fonts.google.com/specimen/Caveat
   - Caveat-Regular.ttf
   - Caveat-Bold.ttf

### Quick Download (Linux/Mac):

```bash
cd /home/user/livingwine/mobile/assets/fonts

# Download Fraunces
curl -L "https://fonts.google.com/download?family=Fraunces" -o Fraunces.zip
unzip -j Fraunces.zip "static/Fraunces-Regular.ttf" "static/Fraunces-Bold.ttf" "static/Fraunces-Black.ttf"

# Download Plus Jakarta Sans
curl -L "https://fonts.google.com/download?family=Plus+Jakarta+Sans" -o PlusJakartaSans.zip
unzip -j PlusJakartaSans.zip "static/PlusJakartaSans-Regular.ttf" "static/PlusJakartaSans-Medium.ttf" "static/PlusJakartaSans-Bold.ttf"

# Download Inter
curl -L "https://fonts.google.com/download?family=Inter" -o Inter.zip
unzip -j Inter.zip "static/Inter-Regular.ttf" "static/Inter-Medium.ttf" "static/Inter-SemiBold.ttf" "static/Inter-Bold.ttf"

# Download Caveat
curl -L "https://fonts.google.com/download?family=Caveat" -o Caveat.zip
unzip -j Caveat.zip "static/Caveat-Regular.ttf" "static/Caveat-Bold.ttf"

# Clean up zip files
rm *.zip

cd ../..
```

## Step 3: Verify Installation

Check that all files are in place:

```bash
ls -la /home/user/livingwine/mobile/assets/fonts/
```

You should see:
- Fraunces-Regular.ttf
- Fraunces-Bold.ttf
- Fraunces-Black.ttf
- PlusJakartaSans-Regular.ttf
- PlusJakartaSans-Medium.ttf
- PlusJakartaSans-Bold.ttf
- Inter-Regular.ttf
- Inter-Medium.ttf
- Inter-SemiBold.ttf
- Inter-Bold.ttf
- Caveat-Regular.ttf
- Caveat-Bold.ttf
- README.md

## Step 4: Test the Design System

Run the demo screen:

```bash
npx expo start
```

Navigate to: `/design-system-demo`

## Step 5: Start Using Components

### Basic Example

Create a new screen:

```tsx
// app/example-screen.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import {
  H1,
  H2,
  BodyText,
  Button,
  Card,
  BackgroundBlob,
  Colors,
  Gradients
} from '@/components/design-system';

export default function ExampleScreen() {
  return (
    <ScrollView style={{ backgroundColor: Colors.cream, flex: 1 }}>
      {/* Background decoration */}
      <BackgroundBlob
        position="top-right"
        gradient={Gradients.sunset}
        size={300}
        opacity={0.2}
      />

      <View style={{ padding: 20 }}>
        {/* Header */}
        <H1>Welcome to Tipsy</H1>
        <BodyText>Natural wine tracking for enthusiasts</BodyText>

        {/* Card */}
        <Card variant="raised" padding={20} style={{ marginTop: 20 }}>
          <H2>Featured Wine</H2>
          <BodyText>
            Discover natural wines from around the world
          </BodyText>
        </Card>

        {/* Buttons */}
        <Button
          variant="primary"
          fullWidth
          style={{ marginTop: 20 }}
          onPress={() => console.log('Check In pressed')}
        >
          Check In Wine
        </Button>

        <Button
          variant="secondary"
          fullWidth
          style={{ marginTop: 12 }}
          onPress={() => console.log('Discover pressed')}
        >
          Discover Wines
        </Button>
      </View>
    </ScrollView>
  );
}
```

### Wine Check-in Screen Example

```tsx
// app/wine-checkin.tsx
import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  H1,
  H3,
  BodyText,
  Button,
  WineCheckInCard,
  BackgroundBlob,
  Colors,
  Gradients
} from '@/components/design-system';

export default function WineCheckInScreen() {
  return (
    <ScrollView style={styles.container}>
      <BackgroundBlob
        position="top-left"
        gradient={Gradients.wine}
        opacity={0.15}
      />

      <View style={styles.content}>
        <H1>Today's Check-ins</H1>

        <WineCheckInCard
          wineStain
          wineColor={Colors.naturalWineRed}
          padding={16}
          style={{ marginTop: 20 }}
        >
          <H3>Domaine Rietsch</H3>
          <BodyText>Sylvaner Orange • 2021</BodyText>
          <BodyText color={Colors.warmGray} size={14}>
            Alsace, France • Natural • Unfiltered
          </BodyText>

          <Button
            variant="accent"
            size="small"
            style={{ marginTop: 12 }}
          >
            View Details
          </Button>
        </WineCheckInCard>

        <Button
          variant="primary"
          fullWidth
          style={{ marginTop: 30 }}
        >
          Add New Check-in
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  content: {
    padding: 20,
  },
});
```

## Common Patterns

### 1. Page Header with Blob

```tsx
<View style={{ position: 'relative' }}>
  <BackgroundBlob position="top-right" />
  <H1>Page Title</H1>
  <BodyText>Description</BodyText>
</View>
```

### 2. Form Layout

```tsx
<Card variant="raised" padding={20}>
  <H2>Form Title</H2>

  {/* Form fields here */}

  <Button variant="primary" fullWidth>
    Submit
  </Button>
</Card>
```

### 3. List of Cards

```tsx
{wines.map((wine) => (
  <WineCheckInCard
    key={wine.id}
    wineStain
    wineColor={Colors.naturalWineRed}
    padding={16}
    style={{ marginBottom: 16 }}
    onPress={() => handleWinePress(wine)}
  >
    <H3>{wine.name}</H3>
    <BodyText>{wine.producer}</BodyText>
  </WineCheckInCard>
))}
```

### 4. Button Group

```tsx
<View style={{ gap: 12 }}>
  <Button variant="primary" fullWidth>Primary Action</Button>
  <Button variant="secondary" fullWidth>Secondary Action</Button>
  <Button variant="ghost">Cancel</Button>
</View>
```

## Typography Quick Reference

```tsx
// Display text (large, with letterpress)
<Text variant="display">Hero Text</Text>

// Headings
<H1>Page Title</H1>
<H2>Section Title</H2>
<H3>Subsection</H3>

// Body text
<BodyText>Regular content</BodyText>
<BodyLargeText>Emphasized content</BodyLargeText>

// Labels
<LabelText>FORM LABEL</LabelText>

// Accent (handwritten)
<AccentText>Special note</AccentText>
```

## Color Usage

```tsx
import { Colors, SemanticColors } from '@/components/design-system';

// Use semantic colors when possible
backgroundColor: SemanticColors.background.primary
color: SemanticColors.text.primary

// Or direct colors
backgroundColor: Colors.cream
color: Colors.naturalWineRed
```

## Troubleshooting

### Fonts not loading

1. Clear cache:
   ```bash
   npx expo start -c
   ```

2. Verify fonts in assets folder:
   ```bash
   ls -la mobile/assets/fonts/
   ```

3. Check console for errors

### Import errors

Make sure your `tsconfig.json` includes path aliases:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### SVG not rendering

Install react-native-svg:
```bash
npx expo install react-native-svg
```

## Next Steps

1. ✅ Read the full documentation: `/mobile/DESIGN_SYSTEM.md`
2. ✅ Explore the demo screen: `/mobile/app/design-system-demo.tsx`
3. ✅ Check dependencies guide: `/mobile/DESIGN_SYSTEM_DEPENDENCIES.md`
4. ✅ Review file structure: `/mobile/DESIGN_SYSTEM_FILES.txt`

## Resources

- **Full Documentation**: `/mobile/DESIGN_SYSTEM.md`
- **Setup Guide**: `/mobile/DESIGN_SYSTEM_DEPENDENCIES.md`
- **Font Guide**: `/mobile/assets/fonts/README.md`
- **Demo Screen**: `/mobile/app/design-system-demo.tsx`

## Support

For questions or issues:

1. Check the troubleshooting section in `/mobile/DESIGN_SYSTEM.md`
2. Review the demo screen code for examples
3. Verify all dependencies are installed
4. Ensure all font files are present

---

**Happy Building!** 🍷

The Tipsy design system is now ready to use. Start creating beautiful, organic interfaces for your natural wine tracking app.
