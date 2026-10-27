<div align="center">

**English** · [العربية](./brand-guidelines.ar.md)

# Mishkaah Brand Guidelines & Identity Manual

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![Specification Version](https://img.shields.io/badge/Version-2.2%20Canonical-C8A96A?style=flat-square)](../README.md)
[![Design Philosophy](https://img.shields.io/badge/Inspiration-Surah%20Al--Nur%2024%3A35-09090B?style=flat-square)](../docs/README.md)
[![License](https://img.shields.io/badge/License-CC%20BY--SA%204.0-10B981?style=flat-square)](https://creativecommons.org/licenses/by-sa/4.0/)

</div>

---

## 1. Philosophical Foundations & Heritage

The visual identity of **Mishkaah (مِشْكَاة)** is inspired by the Verse of Light (*Ayat al-Nur*, Surah Al-Nur 24:35):

> *"Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp..."*

In classical Arabic architectural and linguistic traditions, a **mishkah (مِشْكَاة)** is an unpierced niche in a wall designed to hold an oil lamp (*misbah*). The niche gathers the light, prevents stray gusts from extinguishing the flame, and directs illumination forward with serene intensity.

Within our open corpus ecosystem, Mishkaah serves as that digital and scholarly niche:
- **Preservation**: Shielding sacred texts from corruption, OCR noise, and inaccurate attributions.
- **Illumination**: Illuminating relationships between Quranic verses, prophetic Hadith, narrator biographies (*Tarajim*), and classical jurisprudence (*Fiqh*).
- **Restraint**: Presenting texts with academic modesty, visual stillness, and negative space rather than decorative extravagance.

---

## 2. The Master Marks

The identity comprises two canonical marks, each serving a distinct functional tier:

### 2.1 Primary Calligraphic Mark (`مِشْكَاة`)
The primary brandmark renders the complete name **مِشْكَاة** in master *Diwan Thuluth* calligraphy, encircled by a hairline celestial orbit:

- **Canvas Dimensions**: `1024×1024` square coordinate space.
- **Celestial Orbit Ring**: Centered at `(512, 512)` with radius `r = 360`, stroke width `1.5`, and stroke opacity `0.28`.
- **Primary Use Cases**: Repository landing headers, formal publications, academic preprints, organization certificates, and desktop splash screens.

### 2.2 Secondary Monogram (*Meem* `مـ`)
The monogram abstracts the initial letterform **مـ** (*Meem*) in *Diwan Thuluth*, maintaining the organic calligraphic stroke width and subtle terminal slant:

- **Optical Radius**: Engineered with an optical radius `R = 244.7px` centered on a `1024×1024` grid.
- **Orbit Omission**: The hairline orbit is intentionally omitted on mobile icons and circular avatars to avoid collisions with OS masks.
- **Primary Use Cases**: Mobile app launcher icons, browser favicons (`16×16px` to `32×32px`), compact toolbar buttons (`<= 48px`), and circular social media avatars.

---

## 3. Geometric Proportions & Exclusion Zones

### 3.1 Clear Space
To preserve the sacred dignity and legibility of the mark, maintain a minimum exclusion zone of `0.2H` (where `H` is the total height of the mark) on all four sides:

```
+-------------------------------------------------------+
|                       [ 0.2H ]                        |
|        +-------------------------------------+        |
|        |                                     |        |
|[ 0.2H ]|            MISHKAAH MARK            |[ 0.2H ]|
|        |                                     |        |
|        +-------------------------------------+        |
|                       [ 0.2H ]                        |
+-------------------------------------------------------+
```

No typography, photographic elements, UI borders, or secondary graphics may penetrate this boundary.

### 3.2 Minimum Sizing Rules
- **Primary Mark**:
  - Digital displays: `48×48px` minimum. Below this threshold, legibility of diacritical marks (*tashkeel*) degrades.
  - Physical print: `15×15mm` minimum.
- **Monogram *Meem***:
  - Digital displays: `16×16px` minimum.
  - Physical print: `5×5mm` minimum.
- **Horizontal Lockup**:
  - Digital displays: `120×30px` minimum.
  - Physical print: `35×10mm` minimum.

---

## 4. Color Palette Application

| Environment | Background Token | Foreground Mark | Contrast Ratio |
| :--- | :--- | :--- | :--- |
| **Dark Mode (Default)** | Obsidian (`#09090B`) | Champagne Gold (`#E5CFA0` → `#B89655`) | **11.4:1** (WCAG AAA) |
| **Light Mode (Reading)** | Parchment Alabaster (`#F6F3EC`) | Umber Bronze (`#8A6B2F` → `#553F16`) | **12.8:1** (WCAG AAA) |
| **Transparent Dark Overlay** | Any dark media / video | Gold Transparent Mark | Target `>= 7.0:1` |
| **Monochrome Print** | White Paper (`#FFFFFF`) | Pure Black (`#000000`) | **21.0:1** (WCAG AAA) |

---

## 5. Prohibited Usages

To safeguard brand consistency, the following treatments are strictly banned:

1. **Aspect Ratio Distortion**: Never stretch, squeeze, or non-uniformly scale the calligraphic mark or monogram.
2. **Rotation & Angling**: Never rotate the mark off its horizontal baseline.
3. **Orbit Enclosure in Mobile Icons**: Never place the hairline circular orbit inside mobile application launcher icons, where squircle masks crop or clash with it.
4. **Arbitrary Colorization**: Never recolor the mark with colors outside the accredited tokens (e.g., saturated blues, greens, or neon reds).
5. **Decorative Filters**: Never apply drop shadows, 3D bevels, outer glows, or photographic texture maps over the calligraphic paths.
6. **Live Text Replacement**: Never replace the vector Bezier paths with live font `<text>` tags.

---

## 6. Voice, Tone & Scholarly Humility

The Mishkaah voice embodies classical Islamic scholarly ethics (*Adab al-Talib*):

- **Reverent & Measured**: We handle Quranic text and Hadith with utmost deference. We do not use sensational marketing slogans, hype words, or commercial jargon.
- **Evidence-Based**: Every assertion is backed by verifiable manuscript citations, chain of transmission (*Isnad*) metadata, and accredited scholar attributions.
- **Calm & Focused**: Interfaces emphasize distraction-free reading, generous whitespace, and pure typographic hierarchy.
