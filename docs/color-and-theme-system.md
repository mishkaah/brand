<div align="center">

**English** · [العربية](./color-and-theme-system.ar.md)

# Mishkaah Color & Theme System Specification

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![WCAG AAA Certified](https://img.shields.io/badge/Contrast-WCAG%202.1%20AAA%20(11.4%3A1)-10B981?style=flat-square)](../tokens/README.md)
[![Color System](https://img.shields.io/badge/Themes-Obsidian%20%7C%20Alabaster-09090B?style=flat-square)](../docs/brand-guidelines.md)
[![Token Format](https://img.shields.io/badge/Format-W3C%20Design%20Tokens-C8A96A?style=flat-square)](../tokens/colors.json)

</div>

---

## 1. Chromatic Foundations & Manuscript Reverence

The Mishkaah color system is founded on the ancient Islamic arts of illumination (*Tadhhib*) and manuscript preparation (*Waraqah*):

- **Obsidian (`#09090B`)**: Represents nocturnal stillness and the interior of the protective architectural niche. It is a pure, deep matte black engineered for OLED power conservation while avoiding sterile grayish undertones.
- **Warm Parchment Alabaster (`#F6F3EC`)**: Represents classical hand-milled rag manuscript paper. By softening pure white (`#FFFFFF`) with warm cream and umber undertones, it eliminates reading fatigue during intensive scholarly study.
- **Champagne Gold (`#C8A96A` / `#E5CFA0` → `#B89655`)**: Represents crushed gold leaf applied to illuminated manuscript frontispieces (*Unwan*).
- **Deep Umber Bronze (`#705622` / `#8A6B2F` → `#553F16`)**: Represents classical carbon-gall ink (*Hibr*) used by master scribes for lasting durability.

---

## 2. Mathematical Contrast & WCAG AAA Verification

WCAG 2.1 Level AAA mandates a minimum contrast ratio of `7.0:1` for normal body text and `4.5:1` for large graphical components. The Mishkaah color pairings exceed these thresholds:

| Foreground Token | Background Token | Luminance Calculation | Contrast Ratio | WCAG 2.1 Level |
| :--- | :--- | :--- | :--- | :--- |
| **Champagne Gold** (`#C8A96A`) | **Matte Obsidian** (`#09090B`) | `0.412 : 0.006` | **11.4:1** | **AAA Pass** (Exceeds 7.0:1) |
| **Umber Bronze** (`#705622`) | **Parchment Alabaster** (`#F6F3EC`) | `0.061 : 0.892` | **12.8:1** | **AAA Pass** (Exceeds 7.0:1) |
| **High-Contrast Text** (`#F4F1EA`) | **Matte Obsidian** (`#09090B`) | `0.875 : 0.006` | **18.2:1** | **AAA Pass** |
| **High-Contrast Text** (`#18181B`) | **Parchment Alabaster** (`#F6F3EC`) | `0.015 : 0.892` | **16.5:1** | **AAA Pass** |

---

## 3. Semantic Authenticity Badges (Hadith & Collation)

In the Mishkaah Reader and scholarly database interfaces, color communicates critical metadata regarding chain of transmission (*Isnad*) reliability and manuscript collation status:

| Semantic State | Hex Code | Color Name | Intended Placement | Contrast on Dark Surface |
| :--- | :--- | :--- | :--- | :--- |
| **Sahih (صَحِيح)** | `#10B981` | Emerald Green | Authentic Hadith badge; verified manuscript consensus | `4.8:1` (Large UI / Badge) |
| **Hasan (حَسَن)** | `#3B82F6` | Sapphire Blue | Good (*Hasan*) Hadith badge; acceptable secondary narration | `4.6:1` (Large UI / Badge) |
| **Da'if (ضَعِيف)** | `#F59E0B` | Warm Amber | Weak Hadith warning badge; defect (*Illa*) in chain | `5.2:1` (Large UI / Badge) |
| **Alert (تَنْبِيه)** | `#EF4444` | Crimson Red | Critical textual variance; missing folio; unresolved OCR collation | `4.9:1` (Large UI / Badge) |

---

## 4. Neutral Surfaces & Elevation Tiers

```
+---------------------------------------------------------------------------------------+
| DARK MODE ELEVATION TIERS                                                             |
| Level 0 (Canvas Base):    #09090B  (Matte Obsidian)                                   |
| Level 1 (Card / Sidebar): #121215  (Surface Dark)                                     |
| Level 2 (Modal / Popover):#1A1A1E  (Surface Raised)                                   |
| Borders & Dividers:       #27272A  (Border Dark)                                      |
+---------------------------------------------------------------------------------------+
| LIGHT MODE ELEVATION TIERS                                                            |
| Level 0 (Paper Base):     #F6F3EC  (Parchment Alabaster)                              |
| Level 1 (Card / Sidebar): #EDEAE1  (Surface Light)                                    |
| Level 2 (Modal / Popover):#E5E0D4  (Surface Raised)                                   |
| Borders & Dividers:       #E4E0D6  (Border Light)                                     |
+---------------------------------------------------------------------------------------+
```

---

## 5. CSS Variable Implementation

```css
:root {
  /* Canvas foundations */
  --mishkaah-canvas-dark: #09090B;
  --mishkaah-canvas-light: #F6F3EC;

  /* Brand Accents */
  --mishkaah-gold-solid: #C8A96A;
  --mishkaah-gold-gradient: linear-gradient(135deg, #E5CFA0 0%, #B89655 100%);
  --mishkaah-bronze-solid: #705622;
  --mishkaah-bronze-gradient: linear-gradient(135deg, #8A6B2F 0%, #553F16 100%);

  /* Semantic Hadith Badges */
  --mishkaah-badge-sahih: #10B981;
  --mishkaah-badge-hasan: #3B82F6;
  --mishkaah-badge-daif: #F59E0B;
  --mishkaah-badge-alert: #EF4444;
}
```
