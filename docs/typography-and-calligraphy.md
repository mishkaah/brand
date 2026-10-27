<div align="center">

**English** · [العربية](./typography-and-calligraphy.ar.md)

# Mishkaah Typography & Calligraphy Specification

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![Calligraphy](https://img.shields.io/badge/Script-Diwan%20Thuluth-C8A96A?style=flat-square)](../tokens/README.md)
[![Quran Scripture](https://img.shields.io/badge/Scripture-KFGQPC%20Hafs%20Standard-09090B?style=flat-square)](../docs/README.md)
[![OpenType](https://img.shields.io/badge/OpenType-Full%20Vocalization%20(Tashkeel)-10B981?style=flat-square)](../tokens/README.md)

</div>

---

## 1. Typography as Sacred Architecture

In classical Islamic civilization, the pen (*Al-Qalam*) holds divine significance:

> *"Recite, and your Lord is the most Generous — Who taught by the pen — Taught man that which he knew not."* (Surah Al-Alaq 96:3–5)

Letterforms are not merely arbitrary conduits of information; they embody spiritual balance, geometric discipline, and manuscript reverence. The Mishkaah typographic hierarchy is divided into six specialized tiers to ensure that sacred scripture, scholarly prose, and user interface elements each receive their mathematically appropriate typographic treatment.

---

## 2. The Six Typographic Tiers

```
+---------------------------------------------------------------------------------------+
| 1. BRANDMARK TIER                                                                     |
|    Diwan Thuluth Calligraphy (Cubic Bezier vector paths, 0 font dependencies)        |
+---------------------------------------------------------------------------------------+
| 2. SACRED SCRIPTURE TIER                                                              |
|    KFGQPC Uthmanic Script HAFS / Amiri Quran (Preserved Uthmanic orthography)        |
+---------------------------------------------------------------------------------------+
| 3. CLASSICAL PROSE & SCHOLARSHIP TIER                                                 |
|    Amiri / Traditional Arabic (Hadith Matns, Tafseer, Narrator Biographies)           |
+---------------------------------------------------------------------------------------+
| 4. MODERN ARABIC UI TIER                                                              |
|    SF Arabic (iOS) / Noto Sans Arabic (Android & Web) (Buttons, Menus, Navbars)       |
+---------------------------------------------------------------------------------------+
| 5. LATIN & NUMERALS TIER                                                              |
|    SF Pro Rounded (iOS) / Inter (Android & Web) (URNs, Verse Indexes, Metadata)       |
+---------------------------------------------------------------------------------------+
| 6. MONOSPACE & CODE TIER                                                              |
|    JetBrains Mono / SF Mono (JSON records, AST validator logs, CLI tools)             |
+---------------------------------------------------------------------------------------+
```

---

## 3. Tier Specifications

### 3.1 Tier 1: Brandmark Calligraphy (*Diwan Thuluth*)
- **Script**: Master *Diwan Thuluth*. Thuluth is celebrated as the "King of Arabic Scripts" for its architectural grandeur, vertical majesty, and intricate ligature intertwining.
- **Extraction Method**: Extracted via macOS CoreText directly into cubic Bezier `<path>` definitions.
- **Invariants**:
  - The vector mark contains zero `<text>` tags and requires no client font installation.
  - Full vocalization (*Tashkeel*) is structurally integrated into the vector path geometry.

### 3.2 Tier 2: Sacred Scripture (*KFGQPC Uthmanic Script HAFS*)
- **Primary Font**: *KFGQPC Uthmanic Script HAFS* (King Fahd Glorious Quran Printing Complex, Madinah).
- **Secondary Fallback**: *Amiri Quran*.
- **Strict Invariant**: Modern sans-serif Arabic fonts (such as Roboto or Arial) must **never** be used for Quranic text. Modern fonts lack Uthmanic orthography markers, authentic *Waqf* (pausing) signs, and verse-ending medallion ligatures.

### 3.3 Tier 3: Classical Scholarly Prose (*Amiri*)
- **Primary Font**: *Amiri* by Khaled Hosny (a revival of the historic Bulaq Press typeface, Cairo 1924).
- **Fallback**: *Amiri Quran*, *Traditional Arabic*, *serif*.
- **Role**: Renders prophetic Hadith texts (*Matn*), chains of transmission (*Isnad*), classical Tafseer commentaries, and jurisprudential treatises.
- **Typographic Treatment**: Line-height of `1.8` to `2.0` to accommodate dense diacritical vocalization marks without overlapping ascenders or descenders.

### 3.4 Tier 4: Modern Arabic Interface (*SF Arabic* & *Noto Sans Arabic*)
- **Apple Environments (iOS, macOS)**: *SF Arabic* (San Francisco Arabic) with system-ui cascade.
- **Android & Web Environments**: *Noto Sans Arabic* by Google.
- **Role**: Navigation bars, modal sheets, filter chips, buttons, and settings screens.
- **Weight Mapping**: Regular (`400`) for secondary labels, Medium (`500`) for body text, Semibold (`600`) for navigation titles.

### 3.5 Tier 5: Latin Metadata & Numerals (*Inter* & *SF Pro Rounded*)
- **Primary Fonts**: *SF Pro Rounded* (Apple) / *Inter* (Cross-platform).
- **Role**: Verse references (e.g., `24:35`), narrator identifiers (`mishkaah:entity:identity:narrator-104`), Gregorian/Hijri dates, and verification timestamps.

### 3.6 Tier 6: Monospace Code (*JetBrains Mono*)
- **Primary Fonts**: *JetBrains Mono*, *SF Mono*, *Menlo*, *Consolas*.
- **Role**: Corpus JSON-LD inspectors, AST validator outputs, terminal output streams, and canonical hash digests.

---

## 4. OpenType Features & Diacritical Stacking

To prevent diacritic collisions in classical Arabic texts, applications rendering Mishkaah content must enable the following OpenType layout features:

```css
.mishkaah-scripture-text {
  font-family: var(--mishkaah-font-quran);
  font-feature-settings:
    "liga" 1,   /* Standard ligatures */
    "dlig" 1,   /* Discretionary ligatures */
    "mark" 1,   /* Mark positioning */
    "mkmk" 1,   /* Mark-to-mark stacking */
    "calt" 1;   /* Contextual alternates */
  text-rendering: optimizeLegibility;
  line-height: 2.2;
}
```

---

## 5. Web Font Cascade Definitions

```css
:root {
  --mishkaah-font-brandmark: "Diwan Thuluth", "Mishafi", "Amiri", serif;
  --mishkaah-font-quran: "KFGQPC Uthmanic Script HAFS", "Amiri Quran", "Traditional Arabic", serif;
  --mishkaah-font-classical: "Amiri", "Amiri Quran", "Traditional Arabic", serif;
  --mishkaah-font-arabic-ui: "SF Arabic", "Noto Sans Arabic", -apple-system, system-ui, sans-serif;
  --mishkaah-font-latin-ui: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --mishkaah-font-mono: "JetBrains Mono", "SF Mono", Menlo, Consolas, monospace;
}
```
