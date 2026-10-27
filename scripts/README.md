<div align="center">

**English** · [العربية](./README.ar.md)

# Mishkaah Brand Automation & Build Scripts

### **تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة**
### **Verified Islamic Heritage. Connected Knowledge.**

[![Runtime](https://img.shields.io/badge/Runtime-Bun%201.0%2B-09090B?style=flat-square)](https://bun.sh)
[![Build Target](https://img.shields.io/badge/Targets-CSS%20%7C%20TS%20%7C%20Dart-C8A96A?style=flat-square)](../tokens/README.md)
[![CI Guard](https://img.shields.io/badge/CI-Automated%20Integrity%20Suite-10B981?style=flat-square)](../.github/workflows/verify-brand.yml)

</div>

---

## Overview

The **`scripts/`** directory contains the automated TypeScript build pipelines, vector extraction utilities, and continuous integration validators for the Mishkaah brand identity repository. All scripts execute deterministically under the [Bun](https://bun.sh) runtime without requiring Python or external runtime dependencies.

---

## Script Catalog

| Script Path | Primary Responsibility | Execution Command |
| :--- | :--- | :--- |
| [`build-tokens.ts`](./build-tokens.ts) | Compiles platform-agnostic token JSON files (`colors.json`, `typography.json`, `motion.json`, `slogans.json`) into typed distribution files (`tokens.css`, `tokens.ts`, `mishkaah_tokens.dart`). | `bun run scripts/build-tokens.ts` |
| [`verify-brand-integrity.ts`](./verify-brand-integrity.ts) | Validates JSON schemas, enforces the zero `<text>` tag rule in vector SVGs, checks bilingual markdown parity, and verifies the ban on LaTeX math syntax. | `bun run scripts/verify-brand-integrity.ts` |

---

## Automated Verification Gates

When [`verify-brand-integrity.ts`](./verify-brand-integrity.ts) runs in GitHub Actions CI, it enforces four strict quality gates:

1. **Token Syntax & Schema**: Validates that all JSON files in `tokens/` parse correctly without syntax flaws or missing properties.
2. **Pure Vector Geometry**: Verifies that every vector mark in `logos/`, `app-icons/`, and `banners/` consists exclusively of closed cubic Bezier `<path>` elements, with zero live font `<text>` tags.
3. **Bilingual Documentation Parity**: Verifies that every subfolder in the repository contains both an English `README.md` and an Arabic `README.ar.md`.
4. **Markdown Formatting Guard**: Scans all `.md` files to ensure no unescaped `$` or `$$` LaTeX math delimiters are present outside code fences.

---

## Local Development & Usage

### Prerequisites
- Install [Bun](https://bun.sh) (`v1.0.0` or later).

### Build Tokens
To rebuild the distribution bundles after updating any JSON token file:
```bash
bun run scripts/build-tokens.ts
```

### Run Integrity Suite
To verify the entire brand repository before committing changes:
```bash
bun run scripts/verify-brand-integrity.ts
```
