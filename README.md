<div align="center">

![Mishkaah](https://raw.githubusercontent.com/mishkaah/brand/main/animations/svg/mishkaah-hero-banner-animated.svg)

**English** · [العربية](./README.ar.md)

# Mishkaah Brand & Design System

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![Brand Status](https://img.shields.io/badge/Brand-System%20v2.2-C8A96A?style=flat-square)](./docs/brand-guidelines.md)
[![Design Tokens](https://img.shields.io/badge/Tokens-CSS%20%7C%20TS%20%7C%20Dart-09090B?style=flat-square)](./tokens/README.md)
[![License](https://img.shields.io/badge/License-CC%20BY--SA%204.0-F6F3EC?style=flat-square&logoColor=09090B)](https://creativecommons.org/licenses/by-sa/4.0/)

</div>

---

## Overview

The **`mishkaah/brand`** repository maintains the official visual identity, vector calligraphic marks, mobile application icons, repository banners, motion graphics, design tokens, and identity manuals for the entire **Mishkaah (مِشْكَاة)** ecosystem.

The identity draws inspiration from the Verse of Light (*Ayat al-Nur*, Surah Al-Nur 24:35). The visual mark embodies an architectural niche (*mishkah*) housing classical Islamic learning through reverent, museum-grade Arabic calligraphy.

- **Primary Calligraphic Mark**: The full name **مِشْكَاة** rendered in classical master *Diwan Thuluth* calligraphy. Used across all primary headers, documents, and standard surfaces.
- **Secondary Monogram**: The initial letterform **مـ** (*Meem*) in *Diwan Thuluth*, engineered for compact spaces (<= 48px), favicons, and circular avatars.

---

## Visual Showcase & Repository Map

| Directory | Scope & Assets | Formats | Guide |
| :--- | :--- | :--- | :--- |
| [**`logos/`**](./logos/README.md) | Primary Calligraphic Marks, Horizontal Lockups, and *Meem* Monograms | `.svg`, `.png`, `.webp` | [Logos Guide](./logos/README.md) |
| [**`app-icons/`**](./app-icons/README.md) | iOS 18+ (Dark, Light, Tinted), Android Adaptive (Foreground, Monochrome, Backgrounds), Favicons | `.svg`, `.png`, `.ico` | [App Icons Guide](./app-icons/README.md) |
| [**`banners/`**](./banners/README.md) | Social OpenGraph cards (1280×640), GitHub Org Hero (1600×500), 4 Repo Pillar Banners (1600×500) | `.svg`, `.png` | [Banners Guide](./banners/README.md) |
| [**`animations/`**](./animations/README.md) | Reveal & emergence motion: Animated SVGs, Lottie JSON, 60fps MP4/WebM videos (16:9, 9:16, 1:1) | `.svg`, `.lottie.json`, `.mp4`, `.webm` | [Animations Guide](./animations/README.md) |
| [**`tokens/`**](./tokens/README.md) | Machine-readable color palettes, typography, motion curves, and generated CSS/TS/Dart bundles | `.json`, `.css`, `.ts`, `.dart` | [Tokens Guide](./tokens/README.md) |
| [**`docs/`**](./docs/README.md) | Comprehensive identity manuals: Brand Guidelines, Typography, Color Systems, and Motion Specs | `.md`, `.pdf` | [Documentation](./docs/README.md) |
| [**`scripts/`**](./scripts/README.md) | Deterministic build scripts using macOS CoreText Bezier extraction, Playwright, and FFmpeg | `.ts` | [Scripts Guide](./scripts/README.md) |

### Identity Books & Presentation Materials
- **Brand Identity Book (Printable PDF)**: [`docs/presentations/mishkaah-brand-book.pdf`](./docs/presentations/mishkaah-brand-book.pdf)
- **Executive Identity Overview Sheet**: [`docs/presentations/brand-identity-sheet.png`](./docs/presentations/brand-identity-sheet.png)

---

## Permanent Public Asset URLs

All repositories in the Mishkaah organization ([`core`](https://github.com/mishkaah/core), [`corpus`](https://github.com/mishkaah/corpus), [`sdk`](https://github.com/mishkaah/sdk), [`app`](https://github.com/mishkaah/app), and [`.github`](https://github.com/mishkaah/.github)) as well as external sites and applications reference these permanent GitHub raw URLs directly. Any brand refinement in this repository updates all assets across the ecosystem from a single source of truth.

| Asset Description | Variant / Format | Permanent Raw GitHub URL |
| :--- | :--- | :--- |
| **Primary Mark (Dark)** | Vector SVG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/mark-dark.svg` |
| **Primary Mark (Gold Transparent)** | Vector SVG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/mark-gold-transparent.svg` |
| **Primary Mark (Light)** | Vector SVG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/mark-light.svg` |
| **Monogram *Meem* (Dark)** | Vector SVG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/monogram-dark.svg` |
| **Monogram *Meem* (Gold Transparent)** | Vector SVG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/monogram-gold-transparent.svg` |
| **Horizontal Lockup (Dark)** | Vector SVG (1600×400) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/lockup-horizontal-dark.svg` |
| **Horizontal Lockup (Light)** | Vector SVG (1600×400) | `https://raw.githubusercontent.com/mishkaah/brand/main/logos/lockup-horizontal-light.svg` |
| **GitHub Org Hero Banner** | Vector SVG (1600×500) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/github-hero-dark.svg` |
| **Social OpenGraph Card** | Vector SVG (1280×640) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/social-og-dark.svg` |
| **Repository Banner: Corpus** | Vector SVG (1600×500) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/repo-banner-corpus.svg` |
| **Repository Banner: Core** | Vector SVG (1600×500) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/repo-banner-core.svg` |
| **Repository Banner: SDK** | Vector SVG (1600×500) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/repo-banner-sdk.svg` |
| **Repository Banner: App** | Vector SVG (1600×500) | `https://raw.githubusercontent.com/mishkaah/brand/main/banners/repo-banner-app.svg` |
| **Mobile App Icon (iOS Dark)** | High-Res PNG (1024×1024) | `https://raw.githubusercontent.com/mishkaah/brand/main/app-icons/ios-dark.png` |
| **Mobile App Icon (Android Foreground)** | Adaptive Vector SVG | `https://raw.githubusercontent.com/mishkaah/brand/main/app-icons/android-adaptive-foreground.svg` |
| **Animated Reveal Logo** | Vector Animated SVG | `https://raw.githubusercontent.com/mishkaah/brand/main/animations/svg/mishkaah-reveal-dark.svg` |
| **Lottie Animation Bundle** | Mobile Lottie JSON | `https://raw.githubusercontent.com/mishkaah/brand/main/animations/lottie/mishkaah-splash-reveal-dark.lottie.json` |

---

## Core Brand Invariants

1. **Pure Vector Geometry**: All SVGs contain 100% self-contained cubic Bezier `<path>` outlines extracted directly via CoreText. No `<text>` tags or external font installations are ever required.
2. **WCAG AAA Contrast**: Dark Mode Obsidian (`#09090B`) with Champagne Gold (`#E5CFA0` → `#B89655`) achieves **11.4:1** contrast; Light Mode Alabaster (`#F6F3EC`) with Umber Bronze achieves **12.8:1**.
3. **Calm Scholarly Aesthetic**: Built with reverence, negative space, and mathematical restraint, avoiding decorative visual clutter.
