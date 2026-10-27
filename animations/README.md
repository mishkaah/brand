<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Motion & Animation Suite

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![Motion Specification](https://img.shields.io/badge/Motion-Choreographed%20Bezier-C8A96A?style=flat-square)](../tokens/README.md)
[![Framerate](https://img.shields.io/badge/Framerate-60%20FPS-09090B?style=flat-square)](../docs/motion-and-animation-spec.md)
[![Accessibility](https://img.shields.io/badge/A11y-prefers--reduced--motion-10B981?style=flat-square)](../docs/motion-and-animation-spec.md)

</div>

---

## Overview

The **`animations/`** directory contains vector animations, Lottie animation files, and 60 FPS broadcast video assets for the Mishkaah brand identity. Motion within the Mishkaah system is designed with contemplative reverence, scholarly stillness, and physical restraint. Rather than rapid, flashy transitions, animation reflects the gradual illumination of a niche (*mishkah*) housing an oil lamp.

---

## Motion Choreographies

The motion system defines two primary choreographies:

### 1. Sacred Reveal (`mishkaah-reveal`)
A four-phase ceremonial sequence where the celestial orbit draws into existence, the calligraphic *rasm* (base letterforms) unrolls smoothly from right to left, the *tashkeel* (diacritical marks) settle softly, and a subtle golden sheen sweeps across the mark.

- **Phase 1: Aura & Orbit (`0.0s – 0.9s`)**: Subtle ambient golden glow awakens at the optical center while the celestial hairline orbit ring (`r = 360`) draws clockwise from `0` to `2π` using `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Phase 2: Rasm Trace (`0.4s – 1.8s`)**: The primary calligraphic body of **مِشْكَاة** unrolls from right to left along its pen strokes, revealing the warm golden gradient fill.
- **Phase 3: Tashkeel Sequence (`1.5s – 2.5s`)**: Diacritical marks drop into position sequentially (*Kasra*, *Sheen Dots*, *Sukun*, *Fatha*, *Ta Marbuta Dots*) with organic vertical settling using `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- **Phase 4: Timeless Stillness (`2.3s – 3.2s`)**: A soft specular shimmer sweeps across the golden strokes before coming to rest in pristine equilibrium.

### 2. Minimalist Emerge (`mishkaah-emerge`)
A lighter, ambient entrance tailored for app launch screens and modal transitions. The mark fades in with a gentle scale emergence (`0.96` to `1.00`) over `1.6s` using `cubic-bezier(0.16, 1, 0.3, 1)`.

---

## Easing Curves & Mathematical Parameters

| Token Identifier | Cubic Bezier Curve | CSS Representation | Purpose & Aesthetic |
| :--- | :--- | :--- | :--- |
| `sacredReveal` | `[0.22, 1, 0.36, 1]` | `cubic-bezier(0.22, 1, 0.36, 1)` | Ceremonial deceleration for stroke drawing and orbit reveal |
| `gentleEmerge` | `[0.16, 1, 0.3, 1]` | `cubic-bezier(0.16, 1, 0.3, 1)` | Ambient awakening and subtle scale emergence |
| `tashkeelFloat` | `[0.34, 1.56, 0.64, 1]` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Organic vertical settle for diacritical vocalization marks |
| `timelessSettle` | `[0.25, 0.1, 0.25, 1]` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Final harmonic rest and specular shimmer settle |

---

## Deliverables Catalog

| Directory / File | Format | Dimensions | Target Surface |
| :--- | :--- | :--- | :--- |
| [`svg/mishkaah-reveal-dark.svg`](./svg/mishkaah-reveal-dark.svg) | Animated SVG | 1024×1024 | Web landing hero, GitHub profiles, documentation |
| [`svg/mishkaah-emerge-dark.svg`](./svg/mishkaah-emerge-dark.svg) | Animated SVG | 1024×1024 | Lightweight web transitions, low-power mode fallback |
| [`lottie/mishkaah-reveal-dark.lottie.json`](./lottie/mishkaah-reveal-dark.lottie.json) | Lottie JSON | Scalable | iOS and Android native splash screens, Flutter reader app |
| [`video/mishkaah-reveal-16x9.mp4`](./video/mishkaah-reveal-16x9.mp4) | H.264 MP4 | 1920×1080 (16:9) | Keynote presentations, YouTube intro bumpers, event projections |
| [`video/mishkaah-reveal-9x16.mp4`](./video/mishkaah-reveal-9x16.mp4) | H.264 MP4 | 1080×1920 (9:16) | Mobile video feeds, vertical media showcases |
| [`video/mishkaah-reveal-1x1.mp4`](./video/mishkaah-reveal-1x1.mp4) | H.264 MP4 | 1080×1080 (1:1) | Square social media cards, Instagram/LinkedIn posts |
| [`video/mishkaah-reveal-16x9.webm`](./video/mishkaah-reveal-16x9.webm) | VP9 WebM | 1920×1080 (16:9) | Modern web browsers requiring transparent video support |
| [`web-player/preview.html`](./web-player/preview.html) | HTML/JS | Responsive | Interactive in-browser player for testing framerate and curves |

---

## Accessibility: Reduced Motion Support

All animations honor user accessibility preferences. When `prefers-reduced-motion: reduce` is detected:
- Stroke unrolling and translation animations are disabled.
- The mark is displayed in its completed, full-opacity state immediately.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
