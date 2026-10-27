<div align="center">

**English** · [العربية](./motion-and-animation-spec.ar.md)

# Mishkaah Motion & Animation Specification

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![Framerate](https://img.shields.io/badge/Framerate-60%20FPS%20Constant-09090B?style=flat-square)](../animations/README.md)
[![Timing Model](https://img.shields.io/badge/Choreography-4--Phase%20Sacred%20Reveal-C8A96A?style=flat-square)](../tokens/motion.json)
[![Accessibility](https://img.shields.io/badge/Accessibility-prefers--reduced--motion-10B981?style=flat-square)](../docs/brand-guidelines.md)

</div>

---

## 1. The Physics of Sacred Illumination

Motion within the Mishkaah brand system rejects sudden, jarring, or flashy digital artifacts. Rather, animation models the physics of light awakening within an oil lamp housed inside an architectural niche (*mishkah*):

- **Reverent Deceleration**: Transitions begin with deliberate poise and settle gently into timeless stillness.
- **Natural Pen Dynamics**: Letters trace along the authentic stroke trajectory of the reed pen (*Qalam*), honoring the historical direction of Arabic calligraphy from right to left.
- **Diacritical Weight**: Diacritical marks (*Tashkeel*) arrive as delicate accents that softly settle into their gravitational equilibrium.

---

## 2. Easing Curves & Mathematical Profiles

```
Curve 1: sacredReveal [0.22, 1, 0.36, 1]
1.0 |                   .-------
    |                .-'
    |             .-'
    |          .-'
0.0 |________.'_________________
    0.0                        1.0

Curve 2: tashkeelFloat [0.34, 1.56, 0.64, 1] (Elastic settle)
1.1 |              .---.
1.0 |             /     '-------
    |           .'
0.0 |_________.'________________
    0.0                        1.0
```

| Token Identifier | Cubic Bezier Definition | CSS Implementation | Functional Role |
| :--- | :--- | :--- | :--- |
| `sacredReveal` | `[0.22, 1, 0.36, 1]` | `cubic-bezier(0.22, 1, 0.36, 1)` | Stroke drawing of the celestial orbit and primary calligraphic rasm |
| `gentleEmerge` | `[0.16, 1, 0.3, 1]` | `cubic-bezier(0.16, 1, 0.3, 1)` | Subtle scale emergence and ambient opacity ramps |
| `tashkeelFloat` | `[0.34, 1.56, 0.64, 1]` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Delicate vertical spring and settling of vocalization accents |
| `timelessSettle` | `[0.25, 0.1, 0.25, 1]` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Specular shimmer sweep and harmonic rest |

---

## 3. Four-Phase Choreography: Sacred Reveal

The master reveal sequence spans a duration of **`3.2 seconds`** at 60 FPS (192 frames):

```
Time (s):  0.0       0.4           1.5         2.3         3.2
           |----------|-------------|-----------|-----------|
Phase 1:   [ Aura & Orbit ]
Phase 2:             [ Calligraphic Rasm Trace ]
Phase 3:                           [ Tashkeel Sequence ]
Phase 4:                                       [ Shimmer & Settle ]
```

### Phase 1: Aura & Orbit (`0.0s – 0.9s`)
- **Aura**: A radial illumination gradient at the center `(512, 512)` expands from `0.0` to `1.0` opacity over `0.6s`.
- **Orbit Ring**: The circular hairline orbit (`r = 360`) draws clockwise starting from the 12 o'clock position (`-π/2`) using `stroke-dashoffset` driven by `sacredReveal`.

### Phase 2: Calligraphic Rasm Trace (`0.4s – 1.8s`)
- The base letterform body of **مِشْكَاة** unrolls smoothly from right to left, tracing the natural path of the calligrapher's hand:
  1. Initial *Meem* loop and downward descending tail.
  2. The triple teeth and connecting ligature of *Sheen*.
  3. The upward diagonal stroke of *Kaaf*.
  4. The soaring vertical shaft of *Alif*.
  5. The final rounded closure of *Ta Marbuta*.

### Phase 3: Tashkeel Sequence (`1.5s – 2.5s`)
Diacritical marks drop sequentially onto the baseline from a vertical offset of `+18px`, settling with `tashkeelFloat`:
- `1.50s`: *Kasra* beneath the *Meem*.
- `1.65s`: Three dots of *Sheen*.
- `1.80s`: *Sukun* atop *Sheen*.
- `1.95s`: *Fatha* atop *Kaaf*.
- `2.10s`: Two diacritical dots of *Ta Marbuta*.

### Phase 4: Timeless Stillness (`2.3s – 3.2s`)
A delicate specular gradient highlight (opacity `0.18`, angle `135deg`) sweeps across the gold letterforms over `0.9s`, before the mark settles into complete rest.

---

## 4. Minimalist Emerge Choreography

For rapid transitions, mobile splash screens, and modal dialogs, the **Minimalist Emerge** choreography provides a concise `1.6s` animation:
- **Opacity**: Animates from `0.0` to `1.0` over `1.2s`.
- **Scale**: Transitions smoothly from `0.96` to `1.00` centered at `(512, 512)`.
- **Curve**: `gentleEmerge` (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 5. Technical Video Standards (60 FPS)

Broadcast and presentation videos maintained in `animations/video/` adhere to the following rendering specifications:

- **Frame Rate**: `60.00` frames per second (constant frame rate).
- **Color Primaries**: ITU-R BT.709 with full color range `[0, 255]`.
- **Video Codecs**:
  - MP4: H.264 / AVC (High Profile Level 4.2), YUV 4:2:0.
  - WebM: VP9 with alpha channel transparency.
- **Aspect Ratios**:
  - `16:9` (`1920×1080`): Keynote and broadcast widescreen.
  - `9:16` (`1080×1920`): Mobile feeds and vertical displays.
  - `1:1` (`1080×1080`): Square social media previews.

---

## 6. Accessibility & Reduced Motion

All web, desktop, and mobile implementations must respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  .mishkaah-animated-mark {
    animation: none !important;
    stroke-dashoffset: 0 !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```
