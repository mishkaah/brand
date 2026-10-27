<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Vector Logos & Marks

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![Vector Quality](https://img.shields.io/badge/Vector-Cubic%20Bezier%20Paths-C8A96A?style=flat-square)](../tokens/README.md)
[![Canvas](https://img.shields.io/badge/Canvas-1024%C3%971024-09090B?style=flat-square)](../docs/brand-guidelines.md)
[![Zero Font Dependency](https://img.shields.io/badge/Text%20Tags-Zero%20(Pure%20Paths)-10B981?style=flat-square)](../docs/typography-and-calligraphy.md)

</div>

---

## Overview

The **`logos/`** directory contains the vector brandmarks, horizontal lockups, and monograms for the Mishkaah ecosystem. All marks are rooted in classical Arabic calligraphy and engineered for architectural elegance, geometric restraint, and timeless readability across high-density digital displays and physical print surfaces.

The identity is anchored by two core marks:
1. **Primary Calligraphic Mark (`مِشْكَاة`)**: The full name rendered in classical *Diwan Thuluth* calligraphy within a fine celestial orbit.
2. **Secondary Monogram (`مـ`)**: The initial letterform *Meem* in *Diwan Thuluth*, optimized for small interfaces (`<= 48px`), favicons, and circular avatars.

---

## Visual Showcase

<div align="center">

| Primary Mark (Dark) | Primary Mark (Gold Transparent) | Monogram *Meem* (Dark) |
| :---: | :---: | :---: |
| <img src="./mark-dark.svg" width="220" alt="Mishkaah Primary Mark Dark" /> | <img src="./mark-gold-transparent.svg" width="220" alt="Mishkaah Primary Mark Gold Transparent" /> | <img src="./monogram-dark.svg" width="220" alt="Mishkaah Monogram Meem Dark" /> |

</div>

---

## Geometry & Mathematical Specification

Every vector file in this directory follows strict geometric parameters:

- **Coordinate System**: Square canvas of `1024×1024` user units with origin `(0, 0)` at top-left and optical center at `(512, 512)`.
- **Celestial Orbit Ring**: Centered at `(512, 512)` with radius `r = 360`, stroke width `1.5`, stroke opacity `0.28`, and subtle golden gradient stroke.
- **Rasm (Letterform Core)**: Classical *Diwan Thuluth* ligature stacking extracted directly to cubic Bezier curve paths via macOS CoreText.
- **Tashkeel (Vocalization Elements)**: Diacritical marks (*Kasra*, *Sheen Dots*, *Sukun*, *Fatha*, *Ta Marbuta Dots*) positioned along balanced vertical axes.
- **Zero Font Dependency**: The SVG files contain zero `<text>` elements. All glyphs are rendered as independent `<path>` definitions. They render identically in any browser, mobile platform, PDF reader, or vector editor without requiring font installations.

---

## Asset Catalog

| File Name | Dimensions | Format | Palette | Intended Placement |
| :--- | :--- | :--- | :--- | :--- |
| [`mark-dark.svg`](./mark-dark.svg) | 1024×1024 | SVG | Obsidian Canvas + Champagne Gold | Primary brand surfaces, dark mode interfaces, documentation covers |
| [`mark-light.svg`](./mark-light.svg) | 1024×1024 | SVG | Alabaster Canvas + Umber Bronze | Print manuscripts, light mode interfaces, research publications |
| [`mark-gold-transparent.svg`](./mark-gold-transparent.svg) | 1024×1024 | SVG | Transparent + Champagne Gold | Dark background overlays, media presentations, video watermarks |
| [`monogram-dark.svg`](./monogram-dark.svg) | 1024×1024 | SVG | Obsidian Canvas + Champagne Gold *Meem* | Mobile application icons, circular social avatars, compact headers |
| [`monogram-gold-transparent.svg`](./monogram-gold-transparent.svg) | 1024×1024 | SVG | Transparent + Champagne Gold *Meem* | Small UI components, toolbars, breadcrumb badges (`<= 48px`) |
| [`lockup-horizontal-dark.svg`](./lockup-horizontal-dark.svg) | 1600×400 | SVG | Obsidian Canvas + Gold Mark & Typography | Web navigation bars, organization headers, slides |
| [`lockup-horizontal-light.svg`](./lockup-horizontal-light.svg) | 1600×400 | SVG | Alabaster Canvas + Bronze Mark & Typography | Document headers, letterheads, academic paper preprints |

---

## Usage Guidelines & Sizing Rules

### Clear Space
Maintain a minimum clear space surrounding all marks equal to `20%` of the mark height (`0.2H`). No typography, UI components, borders, or graphic elements may intrude into this exclusion zone.

### Minimum Reproducible Sizing
- **Primary Calligraphic Mark**:
  - Digital displays: Minimum `48×48px`
  - Print reproduction: Minimum `15×15mm`
- **Monogram *Meem***:
  - Digital displays: Minimum `16×16px` (Favicon size)
  - Print reproduction: Minimum `5×5mm`
- **Horizontal Lockup**:
  - Digital displays: Minimum `120×30px`
  - Print reproduction: Minimum `35×10mm`

### Prohibited Treatments
- Do not stretch, condense, skew, or alter the proportional aspect ratio (`1:1`).
- Do not rotate the calligraphic mark or change its horizontal orientation.
- Do not replace the celestial orbit with irregular or non-circular shapes.
- Do not recolor the mark with saturated neon colors or hues outside the defined brand tokens.
- Do not apply drop shadows, heavy outer glows, or plastic bevel effects.
