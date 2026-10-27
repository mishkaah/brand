<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Brand Automation & Build Scripts

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![Runtime](https://img.shields.io/badge/Runtime-Bun%201.0%2B-09090B?style=flat-square)](https://bun.sh)
[![Build Target](https://img.shields.io/badge/Targets-CSS%20%7C%20TS%20%7C%20Dart-C8A96A?style=flat-square)](../tokens/README.md)
[![Integrity Suite](https://img.shields.io/badge/Integrity-Deterministic%20Verification-10B981?style=flat-square)](./verify-brand-integrity.ts)

</div>

---

## Overview

The **`scripts/`** directory contains the automated TypeScript build pipelines, Swift CoreText vector extraction utilities, raster/video renderers, and deterministic integrity validators for the Mishkaah brand identity repository. All scripts execute locally with mathematical reproducibility under the [Bun](https://bun.sh) runtime.

---

## Script Catalog

| Script Path | Primary Responsibility | Execution Command |
| :--- | :--- | :--- |
| [`extract-calligraphy-paths.swift`](./extract-calligraphy-paths.swift) | Extracts native cubic Bezier curve paths from macOS CoreText for *Diwan Thuluth* calligraphy glyphs, writing raw paths to `tokens/calligraphy-paths.json`. | `swift scripts/extract-calligraphy-paths.swift` |
| [`generate-tokens-dist.ts`](./generate-tokens-dist.ts) | Compiles platform-agnostic token JSON files (`colors.json`, `typography.json`, `motion.json`, `slogans.json`) into typed distribution files (`tokens.css`, `tokens.ts`, `mishkaah_tokens.dart`). | `bun run scripts/generate-tokens-dist.ts` |
| [`generate-vectors-and-tokens.ts`](./generate-vectors-and-tokens.ts) | Generates all vector SVG marks, animated SVGs, Lottie animation bundles, and interactive HTML5 preview players. | `bun run scripts/generate-vectors-and-tokens.ts` |
| [`render-rasters-and-videos.ts`](./render-rasters-and-videos.ts) | Renders ultra-high-resolution PNG and WebP rasters via headless Chromium, compiles 60 FPS broadcast MP4/WebM videos via FFmpeg, and generates the printable PDF brand book. | `bun run scripts/render-rasters-and-videos.ts` |
| [`verify-brand-integrity.ts`](./verify-brand-integrity.ts) | Validates JSON schemas, enforces the zero `<text>` tag rule in vector SVGs, checks bilingual markdown parity, validates all internal/external links and image assets, and enforces the ban on LaTeX math syntax. | `bun run scripts/verify-brand-integrity.ts` |
| [`build-all.ts`](./build-all.ts) | Orchestrates the complete end-to-end deterministic generation and verification pipeline in sequential stages. | `bun run rebuild-all` |

---

## Automated Verification Gates

When [`verify-brand-integrity.ts`](./verify-brand-integrity.ts) runs, it enforces five strict quality gates:

1. **Token Syntax & Schema**: Validates that all JSON files in `tokens/` parse correctly without syntax flaws or missing properties.
2. **Pure Vector Geometry**: Verifies that every vector mark in `logos/`, `app-icons/`, and `banners/` consists exclusively of closed cubic Bezier `<path>` elements, with zero live font `<text>` tags.
3. **Bilingual Documentation Parity**: Verifies that every subfolder in the repository contains both an English `README.md` and an Arabic `README.ar.md`.
4. **Markdown Formatting Guard**: Scans all `.md` files to ensure no unescaped `$` or `$$` LaTeX math delimiters are present outside code fences.
5. **Comprehensive Link & Asset Validation**: Parses every markdown link, image, and raw GitHub asset reference, verifying that targets exist on disk and meet required non-zero byte size thresholds.

---

## Local Development & Usage

### Prerequisites
- Install [Bun](https://bun.sh) (`v1.0.0` or later).
- macOS with Xcode Command Line Tools (for `swift` CoreText extraction).
- FFmpeg (for 60 FPS video compilation).

### Rebuild the Entire Ecosystem
To regenerate all vectors, rasters, videos, design tokens, and documentation collateral deterministically:
```bash
bun run rebuild-all
```

### Run Integrity Suite
To verify the entire brand repository:
```bash
bun run verify
# or
bun run scripts/verify-brand-integrity.ts
```
