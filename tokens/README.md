<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Design Tokens

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![Tokens Spec](https://img.shields.io/badge/Tokens-Design%20Tokens%20W3C%20Draft-C8A96A?style=flat-square)](../docs/color-and-theme-system.md)
[![Platforms](https://img.shields.io/badge/Platforms-CSS%20%7C%20TypeScript%20%7C%20Dart-09090B?style=flat-square)](./dist/tokens.ts)
[![Accessibility](https://img.shields.io/badge/Contrast-WCAG%20AAA%20(11.4%3A1%20%2F%2012.8%3A1)-10B981?style=flat-square)](../docs/color-and-theme-system.md)

</div>

---

## Overview

The **`tokens/`** directory houses the single source of truth for all visual variables across the Mishkaah organization. Design tokens represent fundamental visual decisions — color hex codes, typographic families, motion timing curves, and accredited slogans — defined as platform-agnostic JSON schemas and compiled into type-safe bundles for Web (CSS), TypeScript, and Mobile (Dart/Flutter).

---

## Token Files Hierarchy

```
tokens/
├── colors.json           # Palette hex codes, gradients, surface tokens, and Hadith status badges
├── typography.json       # Font family stacks, fallback cascades, OpenType features
├── slogans.json          # Master ecosystem and repository pillar bilingual slogans
├── motion.json           # Cubic Bezier timing curves, choreography phases, a11y rules
└── dist/
    ├── tokens.css        # Vanilla CSS Custom Properties
    ├── tokens.ts         # Type-safe TypeScript const maps
    └── mishkaah_tokens.dart # Flutter Color and Cubic curve definitions
```

---

## Color System Summary

| Token Key | Role | Value | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| `obsidian` | Canonical dark mode canvas & OLED background | `#09090B` | Baseline |
| `alabaster` | Canonical light mode canvas & paper reading surface | `#F6F3EC` | Baseline |
| `champagneGold` | Sacred calligraphic brandmark, primary accents | `#C8A96A` (`#E5CFA0` → `#B89655`) | **11.4:1** on Obsidian (WCAG AAA) |
| `umberBronze` | Light mode calligraphic mark, classical ink contrast | `#705622` (`#8A6B2F` → `#553F16`) | **12.8:1** on Alabaster (WCAG AAA) |
| `sahih` | Authentic Hadith grading badge | `#10B981` | 4.8:1 on Dark Surface |
| `hasan` | Good (*Hasan*) Hadith grading badge | `#3B82F6` | 4.6:1 on Dark Surface |
| `daif` | Weak (*Da'if*) Hadith grading badge | `#F59E0B` | 5.2:1 on Dark Surface |
| `alert` | Scholarly collation flag / critical warning | `#EF4444` | 4.9:1 on Dark Surface |

---

## Typography Stacks Summary

| Stack Identifier | Font Family Hierarchy | Primary Intended Surface |
| :--- | :--- | :--- |
| `brandmark` | `"Diwan Thuluth", "Mishafi", "Amiri", serif` | Calligraphic marks, organizational identity emblems |
| `quranScripture` | `"KFGQPC Uthmanic Script HAFS", "Amiri Quran", serif` | Sacred Quranic Ayahs with full Uthmanic vocalization |
| `classicalProse` | `"Amiri", "Amiri Quran", "Traditional Arabic", serif` | Hadith matns, classical Tafseer, scholarly biographies |
| `modernArabicUI` | `"SF Arabic", "Noto Sans Arabic", system-ui, sans-serif` | App navigation, menus, buttons, search interfaces |
| `latinAndNumerals` | `"Inter", -apple-system, BlinkMacSystemFont, sans-serif` | Verse numbers, URN addresses, metadata labels |
| `monospaceCode` | `"JetBrains Mono", "SF Mono", Menlo, monospace` | JSON inspectors, AST validator outputs, CLI logs |

---

## Distribution & Usage

### Web & CSS (`dist/tokens.css`)
```css
@import "@mishkaah/brand/tokens/dist/tokens.css";

.reading-surface {
  background-color: var(--mishkaah-color-obsidian);
  color: var(--mishkaah-text-high-dark);
  font-family: var(--mishkaah-font-classical);
}
```

### TypeScript / React (`dist/tokens.ts`)
```typescript
import { MISHKAAH_COLORS, MISHKAAH_SLOGANS } from "./dist/tokens.ts";

console.log(MISHKAAH_SLOGANS.master.en);
// "Preserved Text. Trusted Knowledge."
```

### Flutter / Dart (`dist/mishkaah_tokens.dart`)
```dart
import 'package:mishkaah_brand/tokens/dist/mishkaah_tokens.dart';

Container(
  color: MishkaahColors.obsidian,
  child: Text(
    "مِشْكَاة",
    style: TextStyle(color: MishkaahColors.champagneGold),
  ),
);
```
