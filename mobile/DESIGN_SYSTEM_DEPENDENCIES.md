# Design System Dependencies

Required packages for the Cloudy design system to function properly.

## Core Dependencies

Add these to your `package.json`:

```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "expo-font": "~11.10.0",
    "expo-router": "~3.4.0",
    "expo-splash-screen": "~0.26.0",
    "react": "18.2.0",
    "react-native": "0.73.0",
    "react-native-svg": "14.1.0",
    "react-native-gesture-handler": "~2.14.0"
  },
  "devDependencies": {
    "@types/react": "~18.2.45",
    "typescript": "^5.1.3"
  }
}
```

## Installation Commands

### Using npm:
```bash
npm install expo-font expo-router expo-splash-screen react-native-svg react-native-gesture-handler
```

### Using yarn:
```bash
yarn add expo-font expo-router expo-splash-screen react-native-svg react-native-gesture-handler
```

### Using Expo CLI (recommended):
```bash
npx expo install expo-font expo-router expo-splash-screen react-native-svg react-native-gesture-handler
```

## Package Details

### expo-font
**Purpose:** Load custom fonts (Fraunces, Cabinet Grotesk, Inter, Caveat)
**Used in:** `/mobile/app/_layout.tsx`
**Documentation:** https://docs.expo.dev/versions/latest/sdk/font/

### react-native-svg
**Purpose:** Render SVG elements (BlobShape component, halftone patterns)
**Used in:** `/mobile/components/design-system/BlobShape.tsx`
**Documentation:** https://github.com/software-mansion/react-native-svg

### expo-router
**Purpose:** File-based routing system
**Used in:** App navigation and layout
**Documentation:** https://docs.expo.dev/router/introduction/

### expo-splash-screen
**Purpose:** Control splash screen while fonts load
**Used in:** `/mobile/app/_layout.tsx`
**Documentation:** https://docs.expo.dev/versions/latest/sdk/splash-screen/

### react-native-gesture-handler
**Purpose:** Touch handling for interactive components
**Used in:** Button and Card pressable interactions
**Documentation:** https://docs.swmansion.com/react-native-gesture-handler/

## Optional Dependencies

### For Enhanced Animations (Future Enhancement)

```bash
npx expo install react-native-reanimated
```

**Purpose:** Smooth animations for blob morphing, card transitions
**Note:** Not currently implemented, but recommended for future enhancements

### For Linear Gradients (Alternative Implementation)

```bash
npx expo install expo-linear-gradient
```

**Purpose:** Alternative to SVG gradients for better performance
**Note:** Can be used instead of SVG gradients in BlobShape

## TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/constants/*": ["./constants/*"],
      "@/utils/*": ["./utils/*"]
    }
  }
}
```

## Expo Configuration

Update your `app.json`:

```json
{
  "expo": {
    "name": "Cloudy",
    "slug": "cloudy-natural-wine",
    "scheme": "cloudy",
    "plugins": [
      "expo-router",
      "expo-font"
    ],
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FCF8F2"
    }
  }
}
```

## Development Setup

1. **Install dependencies:**
   ```bash
   npx expo install
   ```

2. **Clear cache and start:**
   ```bash
   npx expo start -c
   ```

3. **Run on iOS:**
   ```bash
   npx expo run:ios
   ```

4. **Run on Android:**
   ```bash
   npx expo run:android
   ```

## Troubleshooting

### "Cannot find module 'react-native-svg'"
```bash
npx expo install react-native-svg
cd ios && pod install && cd ..
```

### "Font not loading"
1. Clear cache: `npx expo start -c`
2. Verify font files exist in `/mobile/assets/fonts/`
3. Check font paths in `_layout.tsx`

### TypeScript errors with path aliases
1. Update `tsconfig.json` with path mappings
2. Restart TypeScript server in your editor

### Android build fails
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Version Compatibility

| Package | Minimum Version | Tested Version |
|---------|----------------|----------------|
| Expo | 49.0.0 | 50.0.0 |
| React Native | 0.72.0 | 0.73.0 |
| React | 18.0.0 | 18.2.0 |
| TypeScript | 5.0.0 | 5.1.3 |

## Production Considerations

### Font Loading Optimization
- Use `expo-font` caching
- Preload fonts in `_layout.tsx`
- Consider using `expo-asset` for font preloading

### Bundle Size
- Current design system adds ~50KB to bundle
- SVG components add minimal overhead
- Font files: ~500KB total (gzipped: ~200KB)

### Performance
- Blob shapes use pure SVG (no bitmap rendering)
- Effects use native shadow APIs
- Typography uses platform-optimized font rendering

## Next Steps

1. ✅ Install all dependencies
2. ✅ Download and place font files in `/mobile/assets/fonts/`
3. ✅ Import design system components
4. ✅ Start building your app!

```typescript
import {
  Text,
  Button,
  Card,
  BlobShape,
  Colors
} from '@/components/design-system';
```
