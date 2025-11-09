# Fonts for Cloudy - Natural Wine App

This directory contains the custom fonts used in the Tipsy aesthetic design system.

## Required Fonts

### 1. Fraunces (Display & Headers)
**Purpose:** Decorative serif for display text and large headings
**License:** SIL Open Font License
**Download:** https://fonts.google.com/specimen/Fraunces

**Files needed:**
- `Fraunces-Regular.ttf` (400)
- `Fraunces-Bold.ttf` (700)
- `Fraunces-Black.ttf` (900)

**Installation:**
```bash
# Download from Google Fonts or use the following files:
Fraunces[opsz,wght,SOFT,WONK].ttf
```

**Note:** Fraunces is a variable font. You can use the variable font file or individual weight files.

---

### 2. Cabinet Grotesk (Body Text)
**Purpose:** Clean geometric sans-serif for body text
**License:** Commercial license required (or substitute with similar)
**Alternative:** Use **Plus Jakarta Sans** (free alternative)
**Download:** https://fonts.google.com/specimen/Plus+Jakarta+Sans

**Files needed:**
- `CabinetGrotesk-Regular.ttf` (400)
- `CabinetGrotesk-Medium.ttf` (500)
- `CabinetGrotesk-Bold.ttf` (700)

**OR Alternative (Plus Jakarta Sans):**
- `PlusJakartaSans-Regular.ttf` (400)
- `PlusJakartaSans-Medium.ttf` (500)
- `PlusJakartaSans-Bold.ttf` (700)

---

### 3. Inter (UI Elements)
**Purpose:** Modern, highly legible sans-serif for UI elements
**License:** SIL Open Font License
**Download:** https://fonts.google.com/specimen/Inter

**Files needed:**
- `Inter-Regular.ttf` (400)
- `Inter-Medium.ttf` (500)
- `Inter-SemiBold.ttf` (600)
- `Inter-Bold.ttf` (700)

---

### 4. Caveat (Handwritten Accents)
**Purpose:** Handwritten feel for special elements and accents
**License:** SIL Open Font License
**Download:** https://fonts.google.com/specimen/Caveat

**Files needed:**
- `Caveat-Regular.ttf` (400)
- `Caveat-Bold.ttf` (700)

---

## Quick Download Script

You can use Google Fonts API to download fonts:

```bash
# Fraunces
curl -o Fraunces.zip "https://fonts.google.com/download?family=Fraunces" && unzip Fraunces.zip -d Fraunces/

# Inter
curl -o Inter.zip "https://fonts.google.com/download?family=Inter" && unzip Inter.zip -d Inter/

# Caveat
curl -o Caveat.zip "https://fonts.google.com/download?family=Caveat" && unzip Caveat.zip -d Caveat/

# Plus Jakarta Sans (Cabinet Grotesk alternative)
curl -o PlusJakartaSans.zip "https://fonts.google.com/download?family=Plus+Jakarta+Sans" && unzip PlusJakartaSans.zip -d PlusJakartaSans/
```

---

## File Structure

After downloading, your fonts directory should look like:

```
mobile/assets/fonts/
├── Fraunces-Regular.ttf
├── Fraunces-Bold.ttf
├── Fraunces-Black.ttf
├── CabinetGrotesk-Regular.ttf (or PlusJakartaSans-Regular.ttf)
├── CabinetGrotesk-Medium.ttf (or PlusJakartaSans-Medium.ttf)
├── CabinetGrotesk-Bold.ttf (or PlusJakartaSans-Bold.ttf)
├── Inter-Regular.ttf
├── Inter-Medium.ttf
├── Inter-SemiBold.ttf
├── Inter-Bold.ttf
├── Caveat-Regular.ttf
├── Caveat-Bold.ttf
└── README.md (this file)
```

---

## Font Loading

Fonts are automatically loaded in `app/_layout.tsx` using `expo-font`.

See the implementation in:
- `/home/user/livingwine/mobile/app/_layout.tsx`

---

## Using Fonts in Components

Fonts are defined in the Typography constants and are automatically applied through the design system components:

```tsx
import { Text, H1, BodyText } from '@/components/design-system';

// Display text uses Fraunces
<Text variant="display">Cloudy</Text>

// Headings use Fraunces Bold
<H1>Welcome to Natural Wine</H1>

// Body text uses Cabinet Grotesk
<BodyText>Explore organic wines...</BodyText>
```

---

## Troubleshooting

### Fonts not loading on iOS
- Clear cache: `expo start -c`
- Rebuild: `npx expo run:ios`

### Fonts not loading on Android
- Check font file names match exactly (case-sensitive)
- Verify font files are .ttf format
- Clear cache and rebuild

### Variable fonts not working
- Use static font files instead of variable fonts
- Ensure individual weight files are named correctly

---

## License Information

All recommended fonts are either:
- **SIL Open Font License** (free for commercial use)
- **Google Fonts** (free with attribution)

Cabinet Grotesk requires a commercial license. We recommend using **Plus Jakarta Sans** as a free alternative.

For production use, please verify license requirements for all fonts.
