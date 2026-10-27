<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Mobile Application Icons

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![iOS 18 Ready](https://img.shields.io/badge/iOS%2018%2B-Dark%20%7C%20Light%20%7C%20Tinted-09090B?style=flat-square)](../docs/brand-guidelines.md)
[![Android Adaptive](https://img.shields.io/badge/Android-Adaptive%20%26%20Monochrome-10B981?style=flat-square)](../tokens/README.md)
[![Safe Zone](https://img.shields.io/badge/Safe%20Zone-R%20%3D%20244.7px%20%28Android%2066dp%29-C8A96A?style=flat-square)](../docs/brand-guidelines.md)

</div>

---

## Overview

The **`app-icons/`** directory provides launcher icons and web favicons for the Mishkaah Reader mobile app and web clients. Every asset adheres strictly to Apple Human Interface Guidelines (HIG) for iOS 18+ and Google Material Design specifications for Android 13+ adaptive launcher icons.

<div align="center">

![Mishkaah App Icon Showcase](./app-icon-showcase-grid.png)

</div>

---

## Safe-Zone Geometry & Mathematical Invariants

Launcher icons operate under distinct physical constraints compared to document brandmarks:

1. **Omission of Outer Celestial Orbit**: On document brandmarks, the hairline orbit ring (`r = 360`) conveys architectural containment. On application launcher icons, this ring is intentionally omitted. Mobile operating systems apply arbitrary masking shapes (iOS continuous squircle, Android circle, squircle, pebble, and rounded square). An outer hairline circle inevitably clips or produces awkward moire clashes with OS masks.
2. **Optical Glyph Radius (`R = 244.7px`)**: The *Meem* monogram glyph is scaled to an optical radius of `R = 244.7px` centered on the `1024×1024` canvas.
3. **Android Adaptive Safe Zone (`66dp / R = 312px`)**: Android adaptive icons require all critical visual content to remain within a centered `66dp` diameter circle on a `108dp` canvas (proportional to `R = 312px` on a `1024×1024` grid). Our optical radius of `244.7px` provides a generous safety buffer, guaranteeing that the calligraphic letterform will never be clipped on any OEM launcher mask (Google Pixel, Samsung One UI, Xiaomi HyperOS, OnePlus OxygenOS).
4. **Apple HIG Optical Margins**: The icon maintains balanced negative space matching Apple HIG grid standards, preventing visual crowding on iOS home screens and dock carousels.

---

## Icon Variants Matrix

| Variant | Target Platform | Canvas Size | Key Assets | Description |
| :--- | :--- | :--- | :--- | :--- |
| **iOS Dark Mode** | iOS 18+, iPadOS, macOS | 1024×1024 | [`app-icon-dark.png`](./app-icon-dark.png), [`app-icon-dark.svg`](./app-icon-dark.svg) | Matte obsidian `#09090B` canvas with Champagne Gold *Meem* monogram |
| **iOS Light Mode** | iOS 18+, iPadOS, macOS | 1024×1024 | [`app-icon-light.png`](./app-icon-light.png), [`app-icon-light.svg`](./app-icon-light.svg) | Warm alabaster `#F6F3EC` parchment canvas with Umber Bronze *Meem* monogram |
| **iOS Tinted Mode** | iOS 18+ Customized Home | 1024×1024 | [`app-icon-tinted.png`](./app-icon-tinted.png), [`app-icon-tinted.svg`](./app-icon-tinted.svg) | Monochrome luminance-mapped alpha mask adapting to user tint selections |
| **Android Foreground** | Android 13+ Adaptive | 1024×1024 | [`android-adaptive-foreground.svg`](./android-adaptive-foreground.svg), [`android-adaptive-foreground.png`](./android-adaptive-foreground.png) | Transparent vector layer containing the centered Champagne Gold *Meem* monogram |
| **Android Background (Dark)** | Android Adaptive Layer | 1024×1024 | [`android-adaptive-background-dark.svg`](./android-adaptive-background-dark.svg) | Solid matte obsidian `#09090B` background layer |
| **Android Background (Light)** | Android Adaptive Layer | 1024×1024 | [`android-adaptive-background-light.svg`](./android-adaptive-background-light.svg) | Solid warm alabaster `#F6F3EC` background layer |
| **Favicons & Web Touch** | Web Browsers, PWAs | Variable | [`favicon.svg`](./favicon.svg), [`apple-touch-icon.png`](./apple-touch-icon.png) | Vector SVG favicon for high-DPI browser tabs and Safari pinned tabs |

---

## Implementation Guidelines

### iOS Deployment (`Info.plist` & Asset Catalogs)
For modern iOS projects utilizing Xcode asset catalogs:
- Provide `app-icon-dark.png` as the primary Dark variant in `AppIcon.appiconset`.
- Provide `app-icon-light.png` as the Light variant.
- Provide `app-icon-tinted.png` for iOS 18 tinted appearance rendering.

### Android Deployment (`res/mipmap-anydpi-v26/ic_launcher.xml`)
```xml
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/android_adaptive_background_dark" />
    <foreground android:drawable="@drawable/android_adaptive_foreground" />
    <monochrome android:drawable="@drawable/android_adaptive_foreground" />
</adaptive-icon>
```

### Web Deployment (`index.html`)
```html
<link rel="icon" type="image/svg+xml" href="/brand/app-icons/favicon.svg" />
<link rel="apple-touch-icon" href="/brand/app-icons/apple-touch-icon.png" />
```
