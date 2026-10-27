import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

// =============================================================================
// Zod Validation Schemas for Design Tokens (Strict Typing, 0 any / 0 unknown)
// =============================================================================

const ColorTokenSchema = z
  .object({
    hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    role: z.string(),
    description: z.string().optional(),
  })
  .strict();

const GradientColorTokenSchema = z
  .object({
    gradient: z.tuple([
      z.string().regex(/^#[0-9A-Fa-f]{6}$/),
      z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    ]),
    solid: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    role: z.string(),
    contrastOnObsidian: z.string().optional(),
    contrastOnAlabaster: z.string().optional(),
  })
  .strict();

const ColorsSchema = z
  .object({
    $schema: z.string().url(),
    name: z.string(),
    version: z.string(),
    palettes: z
      .object({
        primary: z
          .object({
            obsidian: ColorTokenSchema,
            alabaster: ColorTokenSchema,
            champagneGold: GradientColorTokenSchema,
            umberBronze: GradientColorTokenSchema,
          })
          .strict(),
        neutrals: z
          .object({
            surfaceDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            borderDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            textMutedDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            textHighDark: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            surfaceLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            borderLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            textMutedLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
            textHighLight: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          })
          .strict(),
        semantic: z
          .object({
            sahih: ColorTokenSchema,
            hasan: ColorTokenSchema,
            daif: ColorTokenSchema,
            alert: ColorTokenSchema,
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

const TypographyStackSchema = z
  .object({
    fontFamily: z.array(z.string()).optional(),
    ios: z.array(z.string()).optional(),
    android: z.array(z.string()).optional(),
    web: z.array(z.string()).optional(),
    role: z.string(),
    features: z.array(z.string()).optional(),
  })
  .strict();

const TypographySchema = z
  .object({
    $schema: z.string().url(),
    name: z.string(),
    version: z.string(),
    stacks: z
      .object({
        brandmark: TypographyStackSchema,
        quranScripture: TypographyStackSchema,
        classicalProse: TypographyStackSchema,
        modernArabicUI: TypographyStackSchema,
        latinAndNumerals: TypographyStackSchema,
        monospaceCode: TypographyStackSchema,
      })
      .strict(),
  })
  .strict();

const SlogansSchema = z
  .object({
    $schema: z.string().url(),
    name: z.string(),
    version: z.string(),
    master: z
      .object({
        ar: z.string(),
        en: z.string(),
      })
      .strict(),
    pillars: z
      .object({
        corpus: z
          .object({
            titleAr: z.string(),
            titleEn: z.string(),
            ar: z.string(),
            en: z.string(),
          })
          .strict(),
        app: z
          .object({
            titleAr: z.string(),
            titleEn: z.string(),
            ar: z.string(),
            en: z.string(),
          })
          .strict(),
        core: z
          .object({
            titleAr: z.string(),
            titleEn: z.string(),
            ar: z.string(),
            en: z.string(),
          })
          .strict(),
        sdk: z
          .object({
            titleAr: z.string(),
            titleEn: z.string(),
            ar: z.string(),
            en: z.string(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

const MotionEasingSchema = z
  .object({
    cubicBezier: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    css: z.string(),
    description: z.string(),
  })
  .strict();

const MotionPhaseSchema = z
  .object({
    start: z.string(),
    end: z.string(),
    elements: z.array(z.string()),
  })
  .strict();

const MotionSchema = z
  .object({
    $schema: z.string().url(),
    name: z.string(),
    version: z.string(),
    easings: z
      .object({
        sacredReveal: MotionEasingSchema,
        gentleEmerge: MotionEasingSchema,
        tashkeelFloat: MotionEasingSchema,
        timelessSettle: MotionEasingSchema,
      })
      .strict(),
    durations: z
      .object({
        orbitDraw: z.string(),
        rasmTrace: z.string(),
        tashkeelStep: z.string(),
        shimmerSweep: z.string(),
        masterSequence: z.string(),
        monogramLoop: z.string(),
      })
      .strict(),
    phases: z
      .object({
        phase1_auraAndOrbit: MotionPhaseSchema,
        phase2_rasmTrace: MotionPhaseSchema,
        phase3_tashkeelSequence: MotionPhaseSchema,
        phase4_timelessStillness: MotionPhaseSchema,
      })
      .strict(),
    accessibility: z
      .object({
        prefersReducedMotion: z
          .object({
            rule: z.string(),
            css: z.string(),
          })
          .strict(),
      })
      .strict(),
  })
  .strict();

// =============================================================================
// Generation Engine
// =============================================================================

function generateTokensDist(): void {
  const brandRoot = join(import.meta.dir, "..");
  const tokensDir = join(brandRoot, "tokens");
  const distDir = join(tokensDir, "dist");

  if (!existsSync(distDir)) {
    mkdirSync(distDir, { recursive: true });
  }

  // Parse and validate all JSON token files
  const colorsRaw: JSONValue = JSON.parse(
    readFileSync(join(tokensDir, "colors.json"), "utf8"),
  );
  const typographyRaw: JSONValue = JSON.parse(
    readFileSync(join(tokensDir, "typography.json"), "utf8"),
  );
  const slogansRaw: JSONValue = JSON.parse(
    readFileSync(join(tokensDir, "slogans.json"), "utf8"),
  );
  const motionRaw: JSONValue = JSON.parse(
    readFileSync(join(tokensDir, "motion.json"), "utf8"),
  );

  const colors = ColorsSchema.parse(colorsRaw);
  const typography = TypographySchema.parse(typographyRaw);
  const slogans = SlogansSchema.parse(slogansRaw);
  const motion = MotionSchema.parse(motionRaw);

  // 1. Generate tokens.css
  const cssLines: string[] = [
    "/* 🏛️ Mishkaah Design Tokens (Auto-generated by scripts/generate-tokens-dist.ts) */",
    "/* Version: 2.2.0 | https://github.com/mishkaah */",
    "",
    ":root {",
    "  /* Primary Palette */",
    `  --mishkaah-color-obsidian: ${colors.palettes.primary.obsidian.hex};`,
    `  --mishkaah-color-alabaster: ${colors.palettes.primary.alabaster.hex};`,
    `  --mishkaah-color-gold-solid: ${colors.palettes.primary.champagneGold.solid};`,
    `  --mishkaah-color-gold-gradient-start: ${colors.palettes.primary.champagneGold.gradient[0]};`,
    `  --mishkaah-color-gold-gradient-end: ${colors.palettes.primary.champagneGold.gradient[1]};`,
    `  --mishkaah-color-bronze-solid: ${colors.palettes.primary.umberBronze.solid};`,
    `  --mishkaah-color-bronze-gradient-start: ${colors.palettes.primary.umberBronze.gradient[0]};`,
    `  --mishkaah-color-bronze-gradient-end: ${colors.palettes.primary.umberBronze.gradient[1]};`,
    "",
    "  /* Dark Surface Neutrals */",
    `  --mishkaah-surface-dark: ${colors.palettes.neutrals.surfaceDark};`,
    `  --mishkaah-border-dark: ${colors.palettes.neutrals.borderDark};`,
    `  --mishkaah-text-muted-dark: ${colors.palettes.neutrals.textMutedDark};`,
    `  --mishkaah-text-high-dark: ${colors.palettes.neutrals.textHighDark};`,
    "",
    "  /* Light Surface Neutrals */",
    `  --mishkaah-surface-light: ${colors.palettes.neutrals.surfaceLight};`,
    `  --mishkaah-border-light: ${colors.palettes.neutrals.borderLight};`,
    `  --mishkaah-text-muted-light: ${colors.palettes.neutrals.textMutedLight};`,
    `  --mishkaah-text-high-light: ${colors.palettes.neutrals.textHighLight};`,
    "",
    "  /* Semantic Authentic Hadith Badges */",
    `  --mishkaah-semantic-sahih: ${colors.palettes.semantic.sahih.hex};`,
    `  --mishkaah-semantic-hasan: ${colors.palettes.semantic.hasan.hex};`,
    `  --mishkaah-semantic-daif: ${colors.palettes.semantic.daif.hex};`,
    `  --mishkaah-semantic-alert: ${colors.palettes.semantic.alert.hex};`,
    "",
    "  /* Motion Easings */",
    `  --mishkaah-ease-sacred-reveal: ${motion.easings.sacredReveal.css};`,
    `  --mishkaah-ease-gentle-emerge: ${motion.easings.gentleEmerge.css};`,
    `  --mishkaah-ease-tashkeel-float: ${motion.easings.tashkeelFloat.css};`,
    `  --mishkaah-ease-timeless-settle: ${motion.easings.timelessSettle.css};`,
    "",
    "  /* Motion Durations */",
    `  --mishkaah-duration-orbit-draw: ${motion.durations.orbitDraw};`,
    `  --mishkaah-duration-rasm-trace: ${motion.durations.rasmTrace};`,
    `  --mishkaah-duration-tashkeel-step: ${motion.durations.tashkeelStep};`,
    `  --mishkaah-duration-shimmer: ${motion.durations.shimmerSweep};`,
    `  --mishkaah-duration-master-sequence: ${motion.durations.masterSequence};`,
    `  --mishkaah-duration-monogram-loop: ${motion.durations.monogramLoop};`,
    "",
    "  /* Typography Stacks */",
    `  --mishkaah-font-brandmark: ${(typography.stacks.brandmark.fontFamily ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    `  --mishkaah-font-quran: ${(typography.stacks.quranScripture.fontFamily ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    `  --mishkaah-font-classical-prose: ${(typography.stacks.classicalProse.fontFamily ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    `  --mishkaah-font-ui-arabic: ${(typography.stacks.modernArabicUI.web ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    `  --mishkaah-font-latin: ${(typography.stacks.latinAndNumerals.web ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    `  --mishkaah-font-mono: ${(typography.stacks.monospaceCode.fontFamily ?? []).map((f: string) => (f.includes(" ") ? '"' + f + '"' : f)).join(", ")};`,
    "}",
    "",
    "/* Accessibility: prefers-reduced-motion enforcement */",
    "@media (prefers-reduced-motion: reduce) {",
    "  *, *::before, *::after {",
    "    animation-duration: 0.01ms !important;",
    "    animation-iteration-count: 1 !important;",
    "    transition-duration: 0.01ms !important;",
    "  }",
    "}",
    "",
  ];
  writeFileSync(join(distDir, "tokens.css"), cssLines.join("\n"));

  // 2. Generate tokens.ts
  const tsLines: string[] = [
    "/**",
    " * 🏛️ Mishkaah Design Tokens (TypeScript Source)",
    " * Auto-generated by scripts/generate-tokens-dist.ts. Strictly typed, 0 any / 0 unknown.",
    " */",
    "",
    "export const MISHKAAH_COLORS = {",
    "  primary: {",
    `    obsidian: "${colors.palettes.primary.obsidian.hex}",`,
    `    alabaster: "${colors.palettes.primary.alabaster.hex}",`,
    "    champagneGold: {",
    `      solid: "${colors.palettes.primary.champagneGold.solid}",`,
    `      gradient: ["${colors.palettes.primary.champagneGold.gradient[0]}", "${colors.palettes.primary.champagneGold.gradient[1]}"] as const,`,
    "    },",
    "    umberBronze: {",
    `      solid: "${colors.palettes.primary.umberBronze.solid}",`,
    `      gradient: ["${colors.palettes.primary.umberBronze.gradient[0]}", "${colors.palettes.primary.umberBronze.gradient[1]}"] as const,`,
    "    },",
    "  },",
    "  neutrals: {",
    `    surfaceDark: "${colors.palettes.neutrals.surfaceDark}",`,
    `    borderDark: "${colors.palettes.neutrals.borderDark}",`,
    `    textMutedDark: "${colors.palettes.neutrals.textMutedDark}",`,
    `    textHighDark: "${colors.palettes.neutrals.textHighDark}",`,
    `    surfaceLight: "${colors.palettes.neutrals.surfaceLight}",`,
    `    borderLight: "${colors.palettes.neutrals.borderLight}",`,
    `    textMutedLight: "${colors.palettes.neutrals.textMutedLight}",`,
    `    textHighLight: "${colors.palettes.neutrals.textHighLight}",`,
    "  },",
    "  semantic: {",
    `    sahih: "${colors.palettes.semantic.sahih.hex}",`,
    `    hasan: "${colors.palettes.semantic.hasan.hex}",`,
    `    daif: "${colors.palettes.semantic.daif.hex}",`,
    `    alert: "${colors.palettes.semantic.alert.hex}",`,
    "  },",
    "} as const;",
    "",
    "export const MISHKAAH_MOTION = {",
    "  easings: {",
    `    sacredReveal: [${motion.easings.sacredReveal.cubicBezier.join(", ")}] as const,`,
    `    gentleEmerge: [${motion.easings.gentleEmerge.cubicBezier.join(", ")}] as const,`,
    `    tashkeelFloat: [${motion.easings.tashkeelFloat.cubicBezier.join(", ")}] as const,`,
    `    timelessSettle: [${motion.easings.timelessSettle.cubicBezier.join(", ")}] as const,`,
    "  },",
    "  durations: {",
    `    orbitDraw: "${motion.durations.orbitDraw}",`,
    `    rasmTrace: "${motion.durations.rasmTrace}",`,
    `    tashkeelStep: "${motion.durations.tashkeelStep}",`,
    `    shimmerSweep: "${motion.durations.shimmerSweep}",`,
    `    masterSequence: "${motion.durations.masterSequence}",`,
    `    monogramLoop: "${motion.durations.monogramLoop}",`,
    "  },",
    "} as const;",
    "",
    "export const MISHKAAH_SLOGANS = {",
    "  master: {",
    `    ar: "${slogans.master.ar}",`,
    `    en: "${slogans.master.en}",`,
    "  },",
    "  pillars: {",
    "    corpus: {",
    `      titleAr: "${slogans.pillars.corpus.titleAr}",`,
    `      titleEn: "${slogans.pillars.corpus.titleEn}",`,
    `      ar: "${slogans.pillars.corpus.ar}",`,
    `      en: "${slogans.pillars.corpus.en}",`,
    "    },",
    "    app: {",
    `      titleAr: "${slogans.pillars.app.titleAr}",`,
    `      titleEn: "${slogans.pillars.app.titleEn}",`,
    `      ar: "${slogans.pillars.app.ar}",`,
    `      en: "${slogans.pillars.app.en}",`,
    "    },",
    "    core: {",
    `      titleAr: "${slogans.pillars.core.titleAr}",`,
    `      titleEn: "${slogans.pillars.core.titleEn}",`,
    `      ar: "${slogans.pillars.core.ar}",`,
    `      en: "${slogans.pillars.core.en}",`,
    "    },",
    "    sdk: {",
    `      titleAr: "${slogans.pillars.sdk.titleAr}",`,
    `      titleEn: "${slogans.pillars.sdk.titleEn}",`,
    `      ar: "${slogans.pillars.sdk.ar}",`,
    `      en: "${slogans.pillars.sdk.en}",`,
    "    },",
    "  },",
    "} as const;",
    "",
    "export type MishkaahColors = typeof MISHKAAH_COLORS;",
    "export type MishkaahMotion = typeof MISHKAAH_MOTION;",
    "export type MishkaahSlogans = typeof MISHKAAH_SLOGANS;",
    "",
  ];
  writeFileSync(join(distDir, "tokens.ts"), tsLines.join("\n"));

  // 3. Generate mishkaah_tokens.dart
  const dartLines: string[] = [
    "// 🏛️ Mishkaah Design Tokens (Dart Source for Flutter)",
    "// Auto-generated by scripts/generate-tokens-dist.ts.",
    "",
    "import 'package:flutter/widgets.dart';",
    "",
    "/// Official design tokens for Mishkaah apps.",
    "abstract final class MishkaahTokens {",
    "  // Primary Colors",
    `  static const Color obsidian = Color(0xFF${colors.palettes.primary.obsidian.hex.replace("#", "")});`,
    `  static const Color alabaster = Color(0xFF${colors.palettes.primary.alabaster.hex.replace("#", "")});`,
    `  static const Color goldSolid = Color(0xFF${colors.palettes.primary.champagneGold.solid.replace("#", "")});`,
    `  static const Color goldGradientStart = Color(0xFF${colors.palettes.primary.champagneGold.gradient[0].replace("#", "")});`,
    `  static const Color goldGradientEnd = Color(0xFF${colors.palettes.primary.champagneGold.gradient[1].replace("#", "")});`,
    `  static const Color bronzeSolid = Color(0xFF${colors.palettes.primary.umberBronze.solid.replace("#", "")});`,
    `  static const Color bronzeGradientStart = Color(0xFF${colors.palettes.primary.umberBronze.gradient[0].replace("#", "")});`,
    `  static const Color bronzeGradientEnd = Color(0xFF${colors.palettes.primary.umberBronze.gradient[1].replace("#", "")});`,
    "",
    "  // Dark Neutrals",
    `  static const Color surfaceDark = Color(0xFF${colors.palettes.neutrals.surfaceDark.replace("#", "")});`,
    `  static const Color borderDark = Color(0xFF${colors.palettes.neutrals.borderDark.replace("#", "")});`,
    `  static const Color textMutedDark = Color(0xFF${colors.palettes.neutrals.textMutedDark.replace("#", "")});`,
    `  static const Color textHighDark = Color(0xFF${colors.palettes.neutrals.textHighDark.replace("#", "")});`,
    "",
    "  // Light Neutrals",
    `  static const Color surfaceLight = Color(0xFF${colors.palettes.neutrals.surfaceLight.replace("#", "")});`,
    `  static const Color borderLight = Color(0xFF${colors.palettes.neutrals.borderLight.replace("#", "")});`,
    `  static const Color textMutedLight = Color(0xFF${colors.palettes.neutrals.textMutedLight.replace("#", "")});`,
    `  static const Color textHighLight = Color(0xFF${colors.palettes.neutrals.textHighLight.replace("#", "")});`,
    "",
    "  // Semantic Authenticity Badges",
    `  static const Color sahih = Color(0xFF${colors.palettes.semantic.sahih.hex.replace("#", "")});`,
    `  static const Color hasan = Color(0xFF${colors.palettes.semantic.hasan.hex.replace("#", "")});`,
    `  static const Color daif = Color(0xFF${colors.palettes.semantic.daif.hex.replace("#", "")});`,
    `  static const Color alert = Color(0xFF${colors.palettes.semantic.alert.hex.replace("#", "")});`,
    "",
    "  // Motion Curves",
    `  static const Cubic sacredReveal = Cubic(${motion.easings.sacredReveal.cubicBezier.join(", ")});`,
    `  static const Cubic gentleEmerge = Cubic(${motion.easings.gentleEmerge.cubicBezier.join(", ")});`,
    `  static const Cubic tashkeelFloat = Cubic(${motion.easings.tashkeelFloat.cubicBezier.join(", ")});`,
    `  static const Cubic timelessSettle = Cubic(${motion.easings.timelessSettle.cubicBezier.join(", ")});`,
    "",
    "  // Slogans",
    `  static const String sloganMasterAr = "${slogans.master.ar}";`,
    `  static const String sloganMasterEn = "${slogans.master.en}";`,
    "}",
    "",
  ];
  writeFileSync(join(distDir, "mishkaah_tokens.dart"), dartLines.join("\n"));

  console.log("✨ Successfully generated tokens.css, tokens.ts, and mishkaah_tokens.dart in tokens/dist/!");
}

// Type definition for generic JSON
type JSONValue =
  | string
  | number
  | boolean
  | null
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

generateTokensDist();
