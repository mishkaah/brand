# 🏛️ Mishkaah Brand & Design Assets (`mishkaah/brand`)

<div align="center">

![Mishkaah Header Banner](./banners/mishkaah-social-banner.png)

### **مِشْكَاة | MISHKAAH**
**Open, Structured Islamic Data & Reader Apps**

[![Organization](https://img.shields.io/badge/GitHub-mishkaah-C8A96A?style=flat-square&logo=github)](https://github.com/mishkaah)
[![Brand Architecture](https://img.shields.io/badge/Architecture-v2.2.0-09090B?style=flat-square&logo=bookstack)](./BRAND_AND_ORG_ARCHITECTURE.md)
[![Tokens](https://img.shields.io/badge/Tokens-JSON-F6F3EC?style=flat-square&logo=json)](./tokens/colors.json)

</div>

---

## 📖 Overview

The **`mishkaah/brand`** repository hosts visual identity assets, logos, typography specifications, and mobile application icons for the **Mishkaah (مِشْكَاة)** project.

---

## 🎨 Brand Assets

### 1. The Calligraphic Mark & Monogram
The classical Arabic calligraphy (`مِشْكَاة`) on matte dark `#09090B` background:

| Dark Mark | Transparent Gold Mark | Monogram Emblem (Meem) |
| :---: | :---: | :---: |
| <img src="./logos/mishkaah-mark-dark.png" width="220" alt="Dark Mark" /> | <img src="./logos/mishkaah-mark-gold-transparent.png" width="220" alt="Transparent Gold Mark" /> | <img src="./logos/mishkaah-monogram-dark.png" width="220" alt="Monogram Dark" /> |
| [`Vector SVG`](./logos/mishkaah-mark-dark.svg) • [`PNG`](./logos/mishkaah-mark-dark.png) | [`Vector SVG`](./logos/mishkaah-mark-gold-transparent.svg) • [`PNG`](./logos/mishkaah-mark-gold-transparent.png) | [`Vector SVG`](./logos/mishkaah-monogram-dark.svg) • [`PNG`](./logos/mishkaah-monogram-dark.png) |

---

## 📱 Mobile App Icon Suite (iOS 18+ & Android 13–15+)

Engineered specifically to prevent mask-clipping across iOS squircles, Android circles, and Material You dynamic color theming. The pure *Diwan Thuluth* calligraphic emblem **`مِشْكَاة`** sits strictly within the **66dp / 61% Android circular safe zone** ($R = 244.7\text{px} \ll 312\text{px}$):

<div align="center">

![App Icon Showcase Grid](./app-icons/app-icon-showcase-grid.png)

</div>

### Icon Deliverables:
- **iOS 18 Dark Mode & Default Dark**: [`./app-icons/app-icon-dark.svg`](./app-icons/app-icon-dark.svg) ([PNG](./app-icons/app-icon-dark.png)) — 11.4:1 contrast ratio.
- **iOS 18 Light Mode & Default Light**: [`./app-icons/app-icon-light.svg`](./app-icons/app-icon-light.svg) ([PNG](./app-icons/app-icon-light.png)) — 12.8:1 contrast ratio.
- **iOS 18 Tinted Mode & Android Dynamic**: [`./app-icons/app-icon-tinted.svg`](./app-icons/app-icon-tinted.svg) ([PNG](./app-icons/app-icon-tinted.png)) — flat monochrome silhouette on transparent canvas.
- **Android Adaptive Foreground**: [`./app-icons/android-adaptive-foreground.svg`](./app-icons/android-adaptive-foreground.svg) ([PNG](./app-icons/android-adaptive-foreground.png)) — guaranteed 0% clipping across all launcher shapes.
- **Android Adaptive Backgrounds**: [`./app-icons/android-adaptive-background-dark.svg`](./app-icons/android-adaptive-background-dark.svg) & [`./app-icons/android-adaptive-background-light.svg`](./app-icons/android-adaptive-background-light.svg).
- **Showcase Presentation Board**: [`./app-icons/app-icon-showcase-grid.svg`](./app-icons/app-icon-showcase-grid.svg) ([PNG](./app-icons/app-icon-showcase-grid.png)).

---

## 💎 Design Tokens

Machine-readable JSON design tokens ready for direct import in web, mobile, and desktop applications:
- **Colors**: [`./tokens/colors.json`](./tokens/colors.json)
- **Typography**: [`./tokens/typography.json`](./tokens/typography.json)

---

## 📜 Complete Specification

For the exhaustive brand philosophy, geometric derivations, and repository ecosystem breakdown, see:
👉 [**Brand & Organization Architecture (`BRAND_AND_ORG_ARCHITECTURE.md`)**](./BRAND_AND_ORG_ARCHITECTURE.md)
