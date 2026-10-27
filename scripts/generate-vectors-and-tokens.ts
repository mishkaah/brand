import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";

// =============================================================================
// Zod Strict Schema for calligraphy-paths.json (0 any / 0 unknown)
// =============================================================================

const BoxSchema = z
  .object({
    minX: z.number(),
    minY: z.number(),
    maxX: z.number(),
    maxY: z.number(),
    width: z.number(),
    height: z.number(),
    midX: z.number(),
    midY: z.number(),
  })
  .strict();

const PathItemSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    d: z.string(),
    bounds: BoxSchema,
    length: z.number(),
  })
  .strict();

type PathItem = z.infer<typeof PathItemSchema>;

const MasterMarkSchema = z
  .object({
    canvasWidth: z.number(),
    canvasHeight: z.number(),
    fullPath: z.string(),
    totalLength: z.number(),
    bounds: BoxSchema,
    rasm: z.array(PathItemSchema),
    tashkeel: z.array(PathItemSchema),
  })
  .strict();

const MonogramSchema = z
  .object({
    canvasWidth: z.number(),
    canvasHeight: z.number(),
    fullPath: z.string(),
    totalLength: z.number(),
    bounds: BoxSchema,
  })
  .strict();

const OutlinedTextSchema = z
  .object({
    text: z.string(),
    fontName: z.string(),
    fontSize: z.number(),
    fullPath: z.string(),
    bounds: BoxSchema,
    length: z.number(),
  })
  .strict();

const PillarSloganSchema = z
  .object({
    titleAr: OutlinedTextSchema,
    titleEn: OutlinedTextSchema,
    sloganAr: OutlinedTextSchema,
    sloganEn: OutlinedTextSchema,
  })
  .strict();

const ShowcaseLabelsSchema = z
  .object({
    appIconBottomBanner: OutlinedTextSchema,
    appIconSubtitle: OutlinedTextSchema,
    cardAndroid: OutlinedTextSchema,
    cardIosDark: OutlinedTextSchema,
    cardIosLight: OutlinedTextSchema,
    cardIosTinted: OutlinedTextSchema,
    cardLockupDark: OutlinedTextSchema,
    cardLockupLight: OutlinedTextSchema,
    cardMonogramDark: OutlinedTextSchema,
    cardMonogramLight: OutlinedTextSchema,
    cardPrimaryDark: OutlinedTextSchema,
    cardPrimaryLight: OutlinedTextSchema,
    logoShowcaseSubtitle: OutlinedTextSchema,
    subAndroid1: OutlinedTextSchema,
    subAndroid2: OutlinedTextSchema,
    subIosDark1: OutlinedTextSchema,
    subIosDark2: OutlinedTextSchema,
    subIosLight1: OutlinedTextSchema,
    subIosLight2: OutlinedTextSchema,
    subIosTinted1: OutlinedTextSchema,
    subIosTinted2: OutlinedTextSchema,
  })
  .strict();

export const CalligraphyDataSchema = z
  .object({
    version: z.string(),
    generatedAt: z.string(),
    primaryMark: MasterMarkSchema,
    monogram: MonogramSchema,
    latinWordmark: OutlinedTextSchema,
    masterSloganAr: OutlinedTextSchema,
    masterSloganEn: OutlinedTextSchema,
    pillars: z
      .object({
        corpus: PillarSloganSchema,
        app: PillarSloganSchema,
        core: PillarSloganSchema,
        sdk: PillarSloganSchema,
      })
      .strict(),
    showcaseLabels: ShowcaseLabelsSchema,
  })
  .strict();

export type CalligraphyData = z.infer<typeof CalligraphyDataSchema>;

export function renderMarkGroup(
  calligraphy: CalligraphyData,
  fillExpr: string,
  extraAttrs = "",
): string {
  const attrs = extraAttrs ? ` ${extraAttrs}` : "";
  const contours = [...calligraphy.primaryMark.rasm, ...calligraphy.primaryMark.tashkeel];
  return `<g fill="${fillExpr}" fill-rule="evenodd"${attrs}>\n` +
    contours.map((p) => `    <path d="${p.d}" />`).join("\n") +
    `\n  </g>`;
}

// =============================================================================
// Color & Gradient SVG Definitions
// =============================================================================

const SVG_GRADIENTS = `
  <defs>
    <!-- Champagne Gold Gradient -->
    <linearGradient id="champagneGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E5CFA0" />
      <stop offset="100%" stop-color="#B89655" />
    </linearGradient>

    <!-- Umber Bronze Gradient -->
    <linearGradient id="umberBronze" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8A6B2F" />
      <stop offset="100%" stop-color="#553F16" />
    </linearGradient>

    <!-- Subtle Obsidian Radial Aura Glow -->
    <radialGradient id="obsidianAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C8A96A" stop-opacity="0.08" />
      <stop offset="60%" stop-color="#C8A96A" stop-opacity="0.02" />
      <stop offset="100%" stop-color="#C8A96A" stop-opacity="0.0" />
    </radialGradient>

    <!-- Subtle Alabaster Radial Aura Glow -->
    <radialGradient id="alabasterAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#705622" stop-opacity="0.06" />
      <stop offset="60%" stop-color="#705622" stop-opacity="0.015" />
      <stop offset="100%" stop-color="#705622" stop-opacity="0.0" />
    </radialGradient>
  </defs>
`;

// =============================================================================
// SVG Generator Functions
// =============================================================================

function generateMarkSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light" | "gold-transparent" | "bronze-transparent" | "white-transparent" | "black-transparent",
): string {
  const isDark = theme === "dark";
  const isLight = theme === "light";
  const isGoldTrans = theme === "gold-transparent";
  const isBronzeTrans = theme === "bronze-transparent";
  const isWhiteTrans = theme === "white-transparent";
  const isBlackTrans = theme === "black-transparent";

  let bgRect = "";
  let auraCircle = "";
  let orbitStroke = "#C8A96A";
  let orbitOpacity = "0.28";
  let markFill = "url(#champagneGold)";

  if (isDark) {
    bgRect = `<rect width="1024" height="1024" fill="#09090B" />`;
    auraCircle = `<circle cx="512" cy="512" r="420" fill="url(#obsidianAura)" />`;
    orbitStroke = "#C8A96A";
    orbitOpacity = "0.28";
    markFill = "url(#champagneGold)";
  } else if (isLight) {
    bgRect = `<rect width="1024" height="1024" fill="#F6F3EC" />`;
    auraCircle = `<circle cx="512" cy="512" r="420" fill="url(#alabasterAura)" />`;
    orbitStroke = "#705622";
    orbitOpacity = "0.32";
    markFill = "url(#umberBronze)";
  } else if (isGoldTrans) {
    orbitStroke = "#C8A96A";
    orbitOpacity = "0.35";
    markFill = "url(#champagneGold)";
  } else if (isBronzeTrans) {
    orbitStroke = "#705622";
    orbitOpacity = "0.40";
    markFill = "url(#umberBronze)";
  } else if (isWhiteTrans) {
    orbitStroke = "#FFFFFF";
    orbitOpacity = "0.40";
    markFill = "#FFFFFF";
  } else if (isBlackTrans) {
    orbitStroke = "#09090B";
    orbitOpacity = "0.40";
    markFill = "#09090B";
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  ${bgRect}
  ${auraCircle}
  <!-- Hairline Celestial Orbit (r=360) -->
  <circle cx="512" cy="512" r="360" fill="none" stroke="${orbitStroke}" stroke-width="1.5" stroke-opacity="${orbitOpacity}" />
  <!-- Sovereign Calligraphic Mark: مِشْكَاة (100% Outlined Bezier Path) -->
  ${renderMarkGroup(calligraphy, markFill)}
</svg>
`;
}

function generateMonogramSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light" | "gold-transparent",
): string {
  const isDark = theme === "dark";
  const isLight = theme === "light";

  let bgRect = "";
  let orbitStroke = "#C8A96A";
  let orbitOpacity = "0.28";
  let markFill = "url(#champagneGold)";

  if (isDark) {
    bgRect = `<rect width="1024" height="1024" fill="#09090B" />`;
    orbitStroke = "#C8A96A";
    orbitOpacity = "0.28";
    markFill = "url(#champagneGold)";
  } else if (isLight) {
    bgRect = `<rect width="1024" height="1024" fill="#F6F3EC" />`;
    orbitStroke = "#705622";
    orbitOpacity = "0.32";
    markFill = "url(#umberBronze)";
  } else {
    orbitStroke = "#C8A96A";
    orbitOpacity = "0.35";
    markFill = "url(#champagneGold)";
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  ${bgRect}
  <!-- Hairline Celestial Orbit (r=360) -->
  <circle cx="512" cy="512" r="360" fill="none" stroke="${orbitStroke}" stroke-width="1.5" stroke-opacity="${orbitOpacity}" />
  <!-- Diwan Thuluth Initial Monogram: م (100% Outlined Bezier Path) -->
  <path d="${calligraphy.monogram.fullPath}" fill="${markFill}" fill-rule="evenodd" />
</svg>
`;
}

function generateHorizontalLockupSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#09090B" : "#F6F3EC";
  const markFill = isDark ? "url(#champagneGold)" : "url(#umberBronze)";
  const dividerStroke = isDark ? "#C8A96A" : "#705622";
  const titleFill = isDark ? "#F4F1EA" : "#18181B";
  const sloganArFill = isDark ? "#C8A96A" : "#705622";
  const sloganEnFill = isDark ? "#A1A1AA" : "#7A756B";

  // Canvas 1600x480
  // Left: Mark and Orbit in 1024x1024 space scaled by 0.50, centered at X=280, Y=240
  const markScale = 0.50;
  const markTX = 280 - 512 * markScale;
  const markTY = 240 - 512 * markScale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 480" width="1600" height="480">
${SVG_GRADIENTS}
  <rect width="1600" height="480" fill="${bg}" />

  <!-- Left Calligraphic Mark with Hairline Orbit -->
  <g transform="translate(${markTX.toFixed(2)}, ${markTY.toFixed(2)}) scale(${markScale})">
    <circle cx="512" cy="512" r="360" fill="none" stroke="${dividerStroke}" stroke-width="2.5" stroke-opacity="0.30" />
    ${renderMarkGroup(calligraphy, markFill)}
  </g>

  <!-- Vertical Hairline Divider -->
  <line x1="560" y1="90" x2="560" y2="390" stroke="${dividerStroke}" stroke-width="1.5" stroke-opacity="0.35" />

  <!-- Right Typography Block (100% Outlined Bezier Paths) -->
  <g transform="translate(620, 120)">
    <!-- 1. MISHKAAH Latin Wordmark -->
    <g transform="translate(0, 0) scale(1.35)">
      <path d="${calligraphy.latinWordmark.fullPath}" fill="${titleFill}" />
    </g>

    <!-- 2. Master Slogan Arabic: تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة -->
    <g transform="translate(0, 85) scale(1.5)">
      <path d="${calligraphy.masterSloganAr.fullPath}" fill="${sloganArFill}" />
    </g>

    <!-- 3. Master Slogan English: VERIFIED ISLAMIC HERITAGE · CONNECTED KNOWLEDGE -->
    <g transform="translate(0, 175) scale(1.15)">
      <path d="${calligraphy.masterSloganEn.fullPath}" fill="${sloganEnFill}" />
    </g>
  </g>
</svg>
`;
}

function generateAppIconSVG(
  calligraphy: CalligraphyData,
  theme: "ios-dark" | "ios-light" | "ios-tinted" | "android-adaptive-foreground" | "android-adaptive-monochrome" | "favicon",
): string {
  // Mobile app icons strip the outer orbit circle to prevent collision with OS squircle or circle masks
  // Safe zone radius: R = 244.7px < 312px (within 66dp Android safe zone)

  if (theme === "ios-dark") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <rect width="1024" height="1024" fill="#09090B" />
  <circle cx="512" cy="512" r="380" fill="url(#obsidianAura)" />
  ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
</svg>
`;
  }

  if (theme === "ios-light") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <rect width="1024" height="1024" fill="#F6F3EC" />
  <circle cx="512" cy="512" r="380" fill="url(#alabasterAura)" />
  ${renderMarkGroup(calligraphy, "url(#umberBronze)")}
</svg>
`;
  }

  if (theme === "ios-tinted" || theme === "android-adaptive-monochrome") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
  <!-- Monochrome Silhouette on Transparent Canvas for OS Tinting -->
  ${renderMarkGroup(calligraphy, "#FFFFFF")}
</svg>
`;
  }

  if (theme === "android-adaptive-foreground") {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <!-- Android 13-15+ Adaptive Foreground (Confined strictly inside 66dp Safe Zone) -->
  ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
</svg>
`;
  }

  // Favicon (512x512)
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
${SVG_GRADIENTS}
  <rect width="512" height="512" rx="112" fill="#09090B" />
  <g transform="translate(0, 0) scale(0.5)">
    ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
  </g>
</svg>
`;
}

function generateSocialOgBannerSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#09090B" : "#F6F3EC";
  const markFill = isDark ? "url(#champagneGold)" : "url(#umberBronze)";
  const dividerStroke = isDark ? "#C8A96A" : "#705622";
  const titleFill = isDark ? "#F4F1EA" : "#18181B";
  const sloganArFill = isDark ? "#C8A96A" : "#705622";
  const sloganEnFill = isDark ? "#8C7A5B" : "#7A756B";

  // Master OpenGraph Canvas: 1280x640
  // Centered composition:
  // 1. Calligraphic Centerpiece مِشْكَاة: width ~ 489.5, height ~ 327.3, scale 0.65 -> 318x212, centered at X=640, Y=220
  const markScale = 0.62;
  const markTX = 640 - 512 * markScale;
  const markTY = 210 - 512 * markScale;

  // 2. Hairline Divider: X=580 to X=700 at Y=340
  // 3. Latin Wordmark MISHKAAH: scale 0.95, centered at X=640 (offset = 640 - 347.5*0.95/2 = 475), Y=375
  const wmWidth = calligraphy.latinWordmark.bounds.width * 0.95;
  const wmTX = 640 - wmWidth / 2;

  // 4. Master Slogan Arabic: scale 0.90, centered at X=640 (offset = 640 - 234.2*0.9/2 = 535), Y=430
  const arWidth = calligraphy.masterSloganAr.bounds.width * 0.9;
  const arTX = 640 - arWidth / 2;

  // 5. Master Slogan English: scale 0.72, centered at X=640 (offset = 640 - 543.9*0.72/2 = 444), Y=485
  const enWidth = calligraphy.masterSloganEn.bounds.width * 0.72;
  const enTX = 640 - enWidth / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640">
${SVG_GRADIENTS}
  <rect width="1280" height="640" fill="${bg}" />
  <circle cx="640" cy="210" r="320" fill="${isDark ? "url(#obsidianAura)" : "url(#alabasterAura)"}" />

  <!-- 1. Master Calligraphic Centerpiece: مِشْكَاة -->
  <g transform="translate(${markTX.toFixed(2)}, ${markTY.toFixed(2)}) scale(${markScale})">
    ${renderMarkGroup(calligraphy, markFill)}
  </g>

  <!-- 2. Minimal Hairline Divider (120px) -->
  <line x1="580" y1="340" x2="700" y2="340" stroke="${dividerStroke}" stroke-width="1.2" stroke-opacity="0.45" />

  <!-- 3. MISHKAAH Latin Wordmark -->
  <g transform="translate(${wmTX.toFixed(2)}, 365) scale(0.95)">
    <path d="${calligraphy.latinWordmark.fullPath}" fill="${titleFill}" />
  </g>

  <!-- 4. Master Slogan Arabic: تُرَاثٌ مُحَقَّق.. وَمَعْرِفَةٌ مُتَرَابِطَة -->
  <g transform="translate(${arTX.toFixed(2)}, 425) scale(0.90)">
    <path d="${calligraphy.masterSloganAr.fullPath}" fill="${sloganArFill}" />
  </g>

  <!-- 5. Master Slogan English: VERIFIED ISLAMIC HERITAGE · CONNECTED KNOWLEDGE -->
  <g transform="translate(${enTX.toFixed(2)}, 485) scale(0.72)">
    <path d="${calligraphy.masterSloganEn.fullPath}" fill="${sloganEnFill}" />
  </g>
</svg>
`;
}

function generateGithubHeroSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#09090B" : "#F6F3EC";
  const markFill = isDark ? "url(#champagneGold)" : "url(#umberBronze)";
  const dividerStroke = isDark ? "#C8A96A" : "#705622";
  const titleFill = isDark ? "#F4F1EA" : "#18181B";
  const sloganArFill = isDark ? "#C8A96A" : "#705622";
  const sloganEnFill = isDark ? "#8C7A5B" : "#7A756B";

  // Wide 1600x500 Organization README Banner
  const markScale = 0.52;
  const markTX = 300 - 512 * markScale;
  const markTY = 250 - 512 * markScale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500">
${SVG_GRADIENTS}
  <rect width="1600" height="500" fill="${bg}" />
  <circle cx="300" cy="250" r="300" fill="${isDark ? "url(#obsidianAura)" : "url(#alabasterAura)"}" />

  <!-- Left Calligraphic Seal with Hairline Orbit -->
  <g transform="translate(${markTX.toFixed(2)}, ${markTY.toFixed(2)}) scale(${markScale})">
    <circle cx="512" cy="512" r="360" fill="none" stroke="${dividerStroke}" stroke-width="2.5" stroke-opacity="0.30" />
    ${renderMarkGroup(calligraphy, markFill)}
  </g>

  <!-- Vertical Hairline Divider -->
  <line x1="590" y1="80" x2="590" y2="420" stroke="${dividerStroke}" stroke-width="1.5" stroke-opacity="0.35" />

  <!-- Right Typography & Slogan Block -->
  <g transform="translate(660, 115)">
    <!-- Latin Wordmark MISHKAAH -->
    <g transform="translate(0, 0) scale(1.45)">
      <path d="${calligraphy.latinWordmark.fullPath}" fill="${titleFill}" />
    </g>

    <!-- Master Arabic Slogan -->
    <g transform="translate(0, 95) scale(1.55)">
      <path d="${calligraphy.masterSloganAr.fullPath}" fill="${sloganArFill}" />
    </g>

    <!-- Master English Slogan -->
    <g transform="translate(0, 195) scale(1.2)">
      <path d="${calligraphy.masterSloganEn.fullPath}" fill="${sloganEnFill}" />
    </g>
  </g>
</svg>
`;
}

function generateRepoBannerSVG(
  calligraphy: CalligraphyData,
  pillarKey: "corpus" | "app" | "core" | "sdk",
): string {
  const pillar = calligraphy.pillars[pillarKey];
  // 1280x420 Repository Header Banner
  const bg = "#09090B";
  const markFill = "url(#champagneGold)";
  const dividerStroke = "#C8A96A";

  const markScale = 0.44;
  const markTX = 220 - 512 * markScale;
  const markTY = 210 - 512 * markScale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 420" width="1280" height="420">
${SVG_GRADIENTS}
  <rect width="1280" height="420" fill="${bg}" />
  <circle cx="220" cy="210" r="240" fill="url(#obsidianAura)" />

  <!-- Left Calligraphic Seal with Subtle Orbit -->
  <g transform="translate(${markTX.toFixed(2)}, ${markTY.toFixed(2)}) scale(${markScale})">
    <circle cx="512" cy="512" r="360" fill="none" stroke="${dividerStroke}" stroke-width="2.8" stroke-opacity="0.28" />
    ${renderMarkGroup(calligraphy, markFill)}
  </g>

  <!-- Vertical Hairline Divider -->
  <line x1="440" y1="60" x2="440" y2="360" stroke="${dividerStroke}" stroke-width="1.2" stroke-opacity="0.35" />

  <!-- Right Pillar Information Block -->
  <g transform="translate(500, 85)">
    <!-- Pillar Arabic Title -->
    <g transform="translate(0, 0) scale(1.55)">
      <path d="${pillar.titleAr.fullPath}" fill="#F4F1EA" />
    </g>

    <!-- Pillar English Title -->
    <g transform="translate(0, 85) scale(1.15)">
      <path d="${pillar.titleEn.fullPath}" fill="#C8A96A" />
    </g>

    <!-- Hairline Separator -->
    <line x1="0" y1="130" x2="240" y2="130" stroke="${dividerStroke}" stroke-width="1" stroke-opacity="0.30" />

    <!-- Pillar Arabic Slogan -->
    <g transform="translate(0, 160) scale(1.35)">
      <path d="${pillar.sloganAr.fullPath}" fill="#E5CFA0" />
    </g>

    <!-- Pillar English Slogan -->
    <g transform="translate(0, 225) scale(0.95)">
      <path d="${pillar.sloganEn.fullPath}" fill="#8C7A5B" />
    </g>
  </g>
</svg>
`;
}

// =============================================================================
// CSS / SMIL Animated SVG Generators
// =============================================================================

function generateAnimatedRevealSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#09090B" : "#F6F3EC";
  const orbitStroke = isDark ? "#C8A96A" : "#705622";
  const markFill = isDark ? "url(#champagneGold)" : "url(#umberBronze)";
  const strokeColor = isDark ? "#E5CFA0" : "#8A6B2F";

  // Rasm paths and Tashkeel paths
  const rasmPaths = calligraphy.primaryMark.rasm;
  const tashkeelPaths = calligraphy.primaryMark.tashkeel;

  // Stagger tashkeel animations: kasra (1.5s), sheen dots (1.65s), sukun (1.80s), fatha (1.95s), ta marbuta dots (2.10s)
  const tashkeelDelays = [1.5, 1.65, 1.8, 1.95, 2.1];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <style>
    /* 🏛️ Ceremonial Choreography: Stroke-Draw & Sequential Tashkeel Illumination */
    @keyframes orbitDraw {
      0% { stroke-dashoffset: 2262; opacity: 0; }
      20% { opacity: 0.35; }
      100% { stroke-dashoffset: 0; opacity: 0.28; }
    }

    @keyframes rasmStrokeDraw {
      0% { stroke-dashoffset: 1600; fill-opacity: 0; }
      40% { fill-opacity: 0; }
      80% { fill-opacity: 0.85; }
      100% { stroke-dashoffset: 0; fill-opacity: 1; }
    }

    @keyframes tashkeelEmerge {
      0% { opacity: 0; transform: translateY(-8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes auraAwaken {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1.0); opacity: 1; }
    }

    .aura-glow {
      transform-origin: 512px 512px;
      animation: auraAwaken 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .orbit-ring {
      stroke-dasharray: 2262;
      stroke-dashoffset: 2262;
      animation: orbitDraw 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
    }

    .rasm-stroke {
      stroke: ${strokeColor};
      stroke-width: 1.2;
      stroke-dasharray: 1600;
      stroke-dashoffset: 1600;
      fill: ${markFill};
      fill-opacity: 0;
      animation: rasmStrokeDraw 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
    }

    .tashkeel-glyph {
      opacity: 0;
      fill: ${markFill};
      animation: tashkeelEmerge 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    /* Accessibility: Instant static display when user prefers reduced motion */
    @media (prefers-reduced-motion: reduce) {
      .aura-glow { transform: none !important; opacity: 1 !important; animation: none !important; }
      .orbit-ring { stroke-dashoffset: 0 !important; opacity: 0.28 !important; animation: none !important; }
      .rasm-stroke { stroke-dashoffset: 0 !important; fill-opacity: 1 !important; animation: none !important; stroke: none !important; }
      .tashkeel-glyph { opacity: 1 !important; transform: none !important; animation: none !important; }
    }
  </style>

  <rect width="1024" height="1024" fill="${bg}" />
  <circle class="aura-glow" cx="512" cy="512" r="420" fill="${isDark ? "url(#obsidianAura)" : "url(#alabasterAura)"}" />

  <!-- Hairline Celestial Orbit -->
  <circle class="orbit-ring" cx="512" cy="512" r="360" fill="none" stroke="${orbitStroke}" stroke-width="1.5" />

  <!-- Rasm Contours (Connected Base Letters) -->
  <g class="rasm-group" fill-rule="evenodd">
    ${rasmPaths.map((p: PathItem) => `<path id="${p.id}" class="rasm-stroke" d="${p.d}" />`).join("\n    ")}
  </g>

  <!-- Tashkeel Contours (Staggered Sequential Illumination RTL) -->
  <g class="tashkeel-group" fill-rule="evenodd">
    ${tashkeelPaths
      .map(
        (p: PathItem, idx: number) =>
          `<path id="${p.id}" class="tashkeel-glyph" style="animation-delay: ${tashkeelDelays[idx] ?? 1.5}s;" d="${p.d}" />`,
      )
      .join("\n    ")}
  </g>
</svg>
`;
}

function generateAnimatedEmergeSVG(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): string {
  const isDark = theme === "dark";
  const bg = isDark ? "#09090B" : "#F6F3EC";
  const orbitStroke = isDark ? "#C8A96A" : "#705622";
  const markFill = isDark ? "url(#champagneGold)" : "url(#umberBronze)";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <style>
    /* Minimalist Golden Emergence */
    @keyframes sereneEmerge {
      0% { opacity: 0; transform: scale(0.95); }
      100% { opacity: 1; transform: scale(1.0); }
    }

    .emerge-container {
      transform-origin: 512px 512px;
      animation: sereneEmerge 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .emerge-container { opacity: 1 !important; transform: none !important; animation: none !important; }
    }
  </style>

  <rect width="1024" height="1024" fill="${bg}" />
  <g class="emerge-container">
    <circle cx="512" cy="512" r="420" fill="${isDark ? "url(#obsidianAura)" : "url(#alabasterAura)"}" />
    <circle cx="512" cy="512" r="360" fill="none" stroke="${orbitStroke}" stroke-width="1.5" stroke-opacity="0.28" />
    ${renderMarkGroup(calligraphy, markFill)}
  </g>
</svg>
`;
}

function generateAnimatedHeroBannerSVG(calligraphy: CalligraphyData): string {
  // 1600x500 Animated Wide Hero Banner
  const markScale = 0.52;
  const markTX = 300 - 512 * markScale;
  const markTY = 250 - 512 * markScale;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 500" width="1600" height="500">
${SVG_GRADIENTS}
  <style>
    @keyframes fadeIn {
      0% { opacity: 0; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    @keyframes orbitDraw {
      0% { stroke-dashoffset: 2262; opacity: 0; }
      100% { stroke-dashoffset: 0; opacity: 0.30; }
    }

    .hero-orbit {
      stroke-dasharray: 2262;
      stroke-dashoffset: 2262;
      animation: orbitDraw 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.2s forwards;
    }

    .hero-mark {
      opacity: 0;
      animation: fadeIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
    }

    .hero-title {
      opacity: 0;
      animation: fadeIn 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.0s forwards;
    }

    .hero-slogan-ar {
      opacity: 0;
      animation: fadeIn 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.3s forwards;
    }

    .hero-slogan-en {
      opacity: 0;
      animation: fadeIn 1.0s cubic-bezier(0.16, 1, 0.3, 1) 1.6s forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .hero-orbit { stroke-dashoffset: 0 !important; opacity: 0.30 !important; animation: none !important; }
      .hero-mark, .hero-title, .hero-slogan-ar, .hero-slogan-en { opacity: 1 !important; transform: none !important; animation: none !important; }
    }
  </style>

  <rect width="1600" height="500" fill="#09090B" />
  <circle cx="300" cy="250" r="300" fill="url(#obsidianAura)" />

  <!-- Left Calligraphic Seal with Hairline Orbit -->
  <g transform="translate(${markTX.toFixed(2)}, ${markTY.toFixed(2)}) scale(${markScale})">
    <circle class="hero-orbit" cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2.5" />
    ${renderMarkGroup(calligraphy, "url(#champagneGold)", 'class="hero-mark"')}
  </g>

  <!-- Vertical Hairline Divider -->
  <line x1="590" y1="80" x2="590" y2="420" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.35" />

  <!-- Right Typography Block with Staggered Fade-In -->
  <g transform="translate(660, 115)">
    <g class="hero-title" transform="translate(0, 0) scale(1.45)">
      <path d="${calligraphy.latinWordmark.fullPath}" fill="#F4F1EA" />
    </g>
    <g class="hero-slogan-ar" transform="translate(0, 95) scale(1.55)">
      <path d="${calligraphy.masterSloganAr.fullPath}" fill="#C8A96A" />
    </g>
    <g class="hero-slogan-en" transform="translate(0, 195) scale(1.2)">
      <path d="${calligraphy.masterSloganEn.fullPath}" fill="#8C7A5B" />
    </g>
  </g>
</svg>
`;
}

function generateAnimatedMonogramRevealSVG(calligraphy: CalligraphyData): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024">
${SVG_GRADIENTS}
  <style>
    @keyframes monoDraw {
      0% { stroke-dashoffset: 2262; opacity: 0; }
      100% { stroke-dashoffset: 0; opacity: 0.28; }
    }

    @keyframes monoStroke {
      0% { stroke-dashoffset: 1200; fill-opacity: 0; }
      50% { fill-opacity: 0; }
      100% { stroke-dashoffset: 0; fill-opacity: 1; }
    }

    .mono-orbit {
      stroke-dasharray: 2262;
      stroke-dashoffset: 2262;
      animation: monoDraw 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.1s forwards;
    }

    .mono-path {
      stroke: #E5CFA0;
      stroke-width: 1.5;
      stroke-dasharray: 1200;
      stroke-dashoffset: 1200;
      fill: url(#champagneGold);
      fill-opacity: 0;
      animation: monoStroke 1.6s cubic-bezier(0.22, 1, 0.36, 1) 0.4s forwards;
    }

    @media (prefers-reduced-motion: reduce) {
      .mono-orbit { stroke-dashoffset: 0 !important; opacity: 0.28 !important; animation: none !important; }
      .mono-path { stroke-dashoffset: 0 !important; fill-opacity: 1 !important; stroke: none !important; animation: none !important; }
    }
  </style>

  <rect width="1024" height="1024" fill="#09090B" />
  <circle cx="512" cy="512" r="420" fill="url(#obsidianAura)" />
  <circle class="mono-orbit" cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="1.5" />
  <path class="mono-path" d="${calligraphy.monogram.fullPath}" fill-rule="evenodd" />
</svg>
`;
}

// =============================================================================
// Lottie Generator (Valid Bodymovin v5.7+ JSON)
// =============================================================================

function parseSvgPathToLottieShapes(d: string): Array<{
  v: Array<[number, number]>;
  i: Array<[number, number]>;
  o: Array<[number, number]>;
  c: boolean;
}> {
  // Split multiple subpaths by 'M'
  const subpathStrings = d.split(/(?=M)/g).filter((s) => s.trim().length > 0);
  const shapes: Array<{
    v: Array<[number, number]>;
    i: Array<[number, number]>;
    o: Array<[number, number]>;
    c: boolean;
  }> = [];

  for (const sp of subpathStrings) {
    const commands = sp.match(/[MLCQZ][^MLCQZ]*/g) || [];
    const vertices: Array<[number, number]> = [];
    const inTangents: Array<[number, number]> = [];
    const outTangents: Array<[number, number]> = [];
    let closed = false;
    let curX = 0;
    let curY = 0;

    for (const cmd of commands) {
      const type = cmd[0];
      const nums = cmd
        .slice(1)
        .trim()
        .split(/[\s,]+/)
        .filter(Boolean)
        .map(Number);

      if (type === "M") {
        const nx = nums[0];
        const ny = nums[1];
        if (nx !== undefined && ny !== undefined) {
          curX = nx;
          curY = ny;
          vertices.push([curX, curY]);
          inTangents.push([0, 0]);
          outTangents.push([0, 0]);
        }
      } else if (type === "L") {
        const nx = nums[0];
        const ny = nums[1];
        if (nx !== undefined && ny !== undefined) {
          curX = nx;
          curY = ny;
          vertices.push([curX, curY]);
          inTangents.push([0, 0]);
          outTangents.push([0, 0]);
        }
      } else if (type === "Q") {
        // Convert quadratic to cubic bezier approximation
        const cpx = nums[0];
        const cpy = nums[1];
        const x = nums[2];
        const y = nums[3];
        if (
          cpx !== undefined &&
          cpy !== undefined &&
          x !== undefined &&
          y !== undefined
        ) {
          const cp1x = curX + (2 / 3) * (cpx - curX);
          const cp1y = curY + (2 / 3) * (cpy - curY);
          const cp2x = x + (2 / 3) * (cpx - x);
          const cp2y = y + (2 / 3) * (cpy - y);

          if (outTangents.length > 0) {
            outTangents[outTangents.length - 1] = [cp1x - curX, cp1y - curY];
          }
          curX = x;
          curY = y;
          vertices.push([curX, curY]);
          inTangents.push([cp2x - curX, cp2y - curY]);
          outTangents.push([0, 0]);
        }
      } else if (type === "C") {
        const cp1x = nums[0];
        const cp1y = nums[1];
        const cp2x = nums[2];
        const cp2y = nums[3];
        const x = nums[4];
        const y = nums[5];
        if (
          cp1x !== undefined &&
          cp1y !== undefined &&
          cp2x !== undefined &&
          cp2y !== undefined &&
          x !== undefined &&
          y !== undefined
        ) {
          if (outTangents.length > 0) {
            outTangents[outTangents.length - 1] = [cp1x - curX, cp1y - curY];
          }
          curX = x;
          curY = y;
          vertices.push([curX, curY]);
          inTangents.push([cp2x - curX, cp2y - curY]);
          outTangents.push([0, 0]);
        }
      } else if (type === "Z") {
        closed = true;
      }
    }

    if (vertices.length > 0) {
      shapes.push({ v: vertices, i: inTangents, o: outTangents, c: closed });
    }
  }

  return shapes;
}

function generateLottieRevealJSON(
  calligraphy: CalligraphyData,
  theme: "dark" | "light",
): Record<string, unknown> {
  const isDark = theme === "dark";
  const bgRGB = isDark ? [0.035, 0.035, 0.043, 1] : [0.965, 0.953, 0.925, 1];
  const goldRGB = isDark ? [0.784, 0.663, 0.416, 1] : [0.541, 0.42, 0.184, 1];

  const contours = [...calligraphy.primaryMark.rasm, ...calligraphy.primaryMark.tashkeel];
  const markContourGroups = contours.map((p, idx) => {
    const subpaths = parseSvgPathToLottieShapes(p.d);
    const shItems = subpaths.map((sp, sIdx) => ({
      ty: "sh",
      nm: `${p.name}_${sIdx}`,
      ks: {
        a: 0,
        k: {
          i: sp.i,
          o: sp.o,
          v: sp.v,
          c: sp.c,
        },
      },
    }));

    return {
      ty: "gr",
      nm: `Group_${p.name}_${idx}`,
      it: [
        ...shItems,
        {
          ty: "fl",
          nm: "Fill",
          c: { a: 0, k: goldRGB },
          o: { a: 0, k: 100 },
          r: 2, // Even-odd winding rule
        },
        {
          ty: "tr",
          nm: "Transform",
          p: { a: 0, k: [0, 0] },
          a: { a: 0, k: [0, 0] },
          s: { a: 0, k: [100, 100] },
          r: { a: 0, k: 0 },
          o: { a: 0, k: 100 },
        },
      ],
    };
  });

  return {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 180, // 3.0s at 60fps
    w: 1024,
    h: 1024,
    nm: `Mishkaah Calligraphic Reveal (${theme})`,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4, // Shape layer
        nm: "Calligraphy Mark",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [0] },
              { t: 30, s: [0] },
              { t: 90, s: [100] },
            ],
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [0, 0, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 20, s: [96, 96, 100] },
              { t: 110, s: [100, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: markContourGroups,
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "Orbit Ring",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [0] },
              { t: 60, s: [35] },
            ],
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [512, 512, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [
          {
            ty: "el",
            nm: "Ellipse",
            p: { a: 0, k: [0, 0] },
            s: { a: 0, k: [720, 720] },
          },
          {
            ty: "st",
            nm: "Stroke",
            c: { a: 0, k: goldRGB },
            o: { a: 0, k: 100 },
            w: { a: 0, k: 1.5 },
          },
          {
            ty: "tm",
            nm: "Trim Paths",
            s: { a: 0, k: 0 },
            e: {
              a: 1,
              k: [
                { t: 5, s: [0] },
                { t: 70, s: [100] },
              ],
            },
            o: { a: 0, k: 0 },
            m: 1,
          },
        ],
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
      {
        ddd: 0,
        ind: 3,
        ty: 1, // Solid background layer
        nm: "Background",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [512, 512, 0] },
          a: { a: 0, k: [512, 512, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        sw: 1024,
        sh: 1024,
        sc: isDark ? "#09090B" : "#F6F3EC",
        ip: 0,
        op: 180,
        st: 0,
        bm: 0,
      },
    ],
  };
}

function generateLottieMonogramLoaderJSON(calligraphy: CalligraphyData): Record<string, unknown> {
  const goldRGB = [0.784, 0.663, 0.416, 1];
  const monoSubpaths = parseSvgPathToLottieShapes(calligraphy.monogram.fullPath);
  const monoShapes = monoSubpaths.map((sp, idx) => ({
    ty: "sh",
    nm: `MonoContour_${idx}`,
    ks: {
      a: 0,
      k: {
        i: sp.i,
        o: sp.o,
        v: sp.v,
        c: sp.c,
      },
    },
  }));

  return {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120, // 2.0s loop
    w: 512,
    h: 512,
    nm: "Mishkaah Monogram Loader",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "Monogram",
        sr: 1,
        ks: {
          o: {
            a: 1,
            k: [
              { t: 0, s: [30] },
              { t: 60, s: [100] },
              { t: 120, s: [30] },
            ],
          },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [0, 0, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [50, 50, 100] }, // Scaled down to 512 canvas
        },
        ao: 0,
        shapes: [
          {
            ty: "gr",
            nm: "Group",
            it: [
              ...monoShapes,
              {
                ty: "fl",
                nm: "Fill",
                c: { a: 0, k: goldRGB },
                o: { a: 0, k: 100 },
                r: 2,
              },
              {
                ty: "tr",
                nm: "Transform",
                p: { a: 0, k: [0, 0] },
                a: { a: 0, k: [0, 0] },
                s: { a: 0, k: [100, 100] },
                r: { a: 0, k: 0 },
                o: { a: 0, k: 100 },
              },
            ],
          },
        ],
        ip: 0,
        op: 120,
        st: 0,
        bm: 0,
      },
    ],
  };
}

// =============================================================================
// Interactive HTML5 Studio (web-player/preview.html)
// =============================================================================

function generateWebPlayerHTML(calligraphy: CalligraphyData): string {
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mishkaah Animation & Brand Vector Studio</title>
  <link rel="stylesheet" href="../../tokens/dist/tokens.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #09090B;
      color: #F4F1EA;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 20px;
    }
    header {
      text-align: center;
      margin-bottom: 40px;
    }
    h1 {
      font-size: 28px;
      font-weight: 500;
      color: #C8A96A;
      margin-bottom: 8px;
    }
    p.sub {
      font-size: 14px;
      color: #71717A;
      letter-spacing: 2px;
    }
    .studio-container {
      max-width: 1200px;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 32px;
    }
    .card {
      background: #121215;
      border: 1px solid #27272A;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      transition: border-color 0.2s ease;
    }
    .card:hover {
      border-color: #C8A96A;
    }
    .preview-box {
      width: 100%;
      aspect-ratio: 1 / 1;
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      background: #09090B;
      border: 1px solid #1C1C20;
    }
    .preview-box.light {
      background: #F6F3EC;
    }
    .preview-box img, .preview-box object {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: #F4F1EA;
      margin-bottom: 4px;
      align-self: flex-start;
    }
    .card-desc {
      font-size: 13px;
      color: #71717A;
      align-self: flex-start;
      margin-bottom: 16px;
    }
    .controls {
      display: flex;
      gap: 12px;
      width: 100%;
    }
    .btn {
      flex: 1;
      padding: 8px 16px;
      background: #27272A;
      color: #F4F1EA;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      transition: background 0.2s;
    }
    .btn:hover {
      background: #C8A96A;
      color: #09090B;
    }
  </style>
</head>
<body>
  <header>
    <h1>مُخْتَبَرُ مِشْكَاة لِلْحَرَكَةِ وَالْهُوِيَّةِ الْبَصَرِيَّة</h1>
    <p class="sub">MISHKAAH MOTION &amp; VECTOR STUDIO</p>
  </header>

  <div class="studio-container">
    <!-- Card 1: Reveal Animation Dark -->
    <div class="card">
      <div class="preview-box">
        <img src="../svg/mishkaah-reveal-dark.svg" alt="Mishkaah Reveal Dark" />
      </div>
      <div class="card-title">Choreography 1: Calligraphic Stroke Reveal (Dark)</div>
      <div class="card-desc">0.0s Orbit Draw -> 0.4s Rasm Trace -> 1.5s Staggered Tashkeel -> 2.3s Timeless Sheen</div>
      <div class="controls">
        <a class="btn" href="../svg/mishkaah-reveal-dark.svg" target="_blank">Open Vector SVG</a>
      </div>
    </div>

    <!-- Card 2: Reveal Animation Light -->
    <div class="card">
      <div class="preview-box light">
        <img src="../svg/mishkaah-reveal-light.svg" alt="Mishkaah Reveal Light" />
      </div>
      <div class="card-title">Choreography 1: Calligraphic Stroke Reveal (Light)</div>
      <div class="card-desc">Warm Parchment Alabaster canvas with deep umber bronze manuscript ink</div>
      <div class="controls">
        <a class="btn" href="../svg/mishkaah-reveal-light.svg" target="_blank">Open Vector SVG</a>
      </div>
    </div>

    <!-- Card 3: Emerge Animation Dark -->
    <div class="card">
      <div class="preview-box">
        <img src="../svg/mishkaah-emerge-dark.svg" alt="Mishkaah Emerge Dark" />
      </div>
      <div class="card-title">Choreography 2: Serene Emergence (Dark)</div>
      <div class="card-desc">Minimalist ambient glow + gentle scale emergence (0.95 -> 1.0)</div>
      <div class="controls">
        <a class="btn" href="../svg/mishkaah-emerge-dark.svg" target="_blank">Open Vector SVG</a>
      </div>
    </div>

    <!-- Card 4: Monogram Reveal -->
    <div class="card">
      <div class="preview-box">
        <img src="../svg/mishkaah-monogram-reveal-dark.svg" alt="Monogram Reveal" />
      </div>
      <div class="card-title">Monogram: Meem Stroke Reveal</div>
      <div class="card-desc">Diwan Thuluth Meem initial mark for app loaders and compact seals</div>
      <div class="controls">
        <a class="btn" href="../svg/mishkaah-monogram-reveal-dark.svg" target="_blank">Open Vector SVG</a>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

// =============================================================================

function generateLogoShowcaseGridSVG(calligraphy: CalligraphyData): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
${SVG_GRADIENTS}
  <rect width="1600" height="1000" fill="#09090B" />

  <!-- Header -->
  <g transform="translate(800, 60)">
    <!-- Centered Latin Wordmark MISHKAAH -->
    <g transform="translate(${-calligraphy.latinWordmark.bounds.width * 0.5}, 0) scale(1.0)">
      <path d="${calligraphy.latinWordmark.fullPath}" fill="#F4F1EA" />
    </g>
    <!-- Hairline Divider -->
    <line x1="-120" y1="52" x2="120" y2="52" stroke="#C8A96A" stroke-width="1.2" stroke-opacity="0.4" />
    <!-- Centered Subtitle -->
    <g transform="translate(${-calligraphy.showcaseLabels.logoShowcaseSubtitle.bounds.width * 0.5}, 72)">
      <path d="${calligraphy.showcaseLabels.logoShowcaseSubtitle.fullPath}" fill="#8C7A5B" />
    </g>
  </g>

  <!-- Section 1: 4 Primary Mark & Monogram Cards (x=100, 460, 820, 1180, width=320, height=320, y=240) -->
  <!-- Card 1: Primary Dark -->
  <g transform="translate(100, 240)">
    <rect width="320" height="320" rx="16" fill="#121215" stroke="#27272A" stroke-width="1.5" />
    <g transform="translate(160, 150) scale(0.28)">
      <g transform="translate(-512, -512)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2" stroke-opacity="0.3" />
        ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
      </g>
    </g>
    <rect x="0" y="270" width="320" height="50" rx="16" fill="#18181C" />
    <g transform="translate(${160 - calligraphy.showcaseLabels.cardPrimaryDark.bounds.width * 0.5}, ${295 - calligraphy.showcaseLabels.cardPrimaryDark.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardPrimaryDark.fullPath}" fill="#F4F1EA" />
    </g>
  </g>

  <!-- Card 2: Primary Light -->
  <g transform="translate(460, 240)">
    <rect width="320" height="320" rx="16" fill="#EDEAE1" stroke="#E4E0D6" stroke-width="1.5" />
    <g transform="translate(160, 150) scale(0.28)">
      <g transform="translate(-512, -512)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#705622" stroke-width="2" stroke-opacity="0.35" />
        ${renderMarkGroup(calligraphy, "url(#umberBronze)")}
      </g>
    </g>
    <rect x="0" y="270" width="320" height="50" rx="16" fill="#DFDAD0" />
    <g transform="translate(${160 - calligraphy.showcaseLabels.cardPrimaryLight.bounds.width * 0.5}, ${295 - calligraphy.showcaseLabels.cardPrimaryLight.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardPrimaryLight.fullPath}" fill="#18181B" />
    </g>
  </g>

  <!-- Card 3: Monogram Dark -->
  <g transform="translate(820, 240)">
    <rect width="320" height="320" rx="16" fill="#121215" stroke="#27272A" stroke-width="1.5" />
    <g transform="translate(160, 150) scale(0.28)">
      <g transform="translate(-512, -512)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2" stroke-opacity="0.3" />
        <path d="${calligraphy.monogram.fullPath}" fill="url(#champagneGold)" fill-rule="evenodd" />
      </g>
    </g>
    <rect x="0" y="270" width="320" height="50" rx="16" fill="#18181C" />
    <g transform="translate(${160 - calligraphy.showcaseLabels.cardMonogramDark.bounds.width * 0.5}, ${295 - calligraphy.showcaseLabels.cardMonogramDark.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardMonogramDark.fullPath}" fill="#F4F1EA" />
    </g>
  </g>

  <!-- Card 4: Monogram Light -->
  <g transform="translate(1180, 240)">
    <rect width="320" height="320" rx="16" fill="#EDEAE1" stroke="#E4E0D6" stroke-width="1.5" />
    <g transform="translate(160, 150) scale(0.28)">
      <g transform="translate(-512, -512)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#705622" stroke-width="2" stroke-opacity="0.35" />
        <path d="${calligraphy.monogram.fullPath}" fill="url(#umberBronze)" fill-rule="evenodd" />
      </g>
    </g>
    <rect x="0" y="270" width="320" height="50" rx="16" fill="#DFDAD0" />
    <g transform="translate(${160 - calligraphy.showcaseLabels.cardMonogramLight.bounds.width * 0.5}, ${295 - calligraphy.showcaseLabels.cardMonogramLight.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardMonogramLight.fullPath}" fill="#18181B" />
    </g>
  </g>

  <!-- Section 2: 2 Horizontal Lockup Cards (y=610, height=330, width=680, x=100 & 820) -->
  <!-- Lockup Dark -->
  <g transform="translate(100, 610)">
    <rect width="680" height="330" rx="16" fill="#121215" stroke="#27272A" stroke-width="1.5" />
    <g transform="translate(20, 20) scale(0.40)">
      <g transform="translate(${280 - 512 * 0.50}, ${240 - 512 * 0.50}) scale(0.50)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2.5" stroke-opacity="0.30" />
        ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
      </g>
      <line x1="560" y1="90" x2="560" y2="390" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.35" />
      <g transform="translate(620, 120)">
        <g transform="scale(1.35)"><path d="${calligraphy.latinWordmark.fullPath}" fill="#F4F1EA" /></g>
        <g transform="translate(0, 85) scale(1.5)"><path d="${calligraphy.masterSloganAr.fullPath}" fill="#C8A96A" /></g>
        <g transform="translate(0, 175) scale(1.15)"><path d="${calligraphy.masterSloganEn.fullPath}" fill="#A1A1AA" /></g>
      </g>
    </g>
    <rect x="0" y="280" width="680" height="50" rx="16" fill="#18181C" />
    <g transform="translate(${340 - calligraphy.showcaseLabels.cardLockupDark.bounds.width * 0.5}, ${305 - calligraphy.showcaseLabels.cardLockupDark.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardLockupDark.fullPath}" fill="#F4F1EA" />
    </g>
  </g>

  <!-- Lockup Light -->
  <g transform="translate(820, 610)">
    <rect width="680" height="330" rx="16" fill="#EDEAE1" stroke="#E4E0D6" stroke-width="1.5" />
    <g transform="translate(20, 20) scale(0.40)">
      <g transform="translate(${280 - 512 * 0.50}, ${240 - 512 * 0.50}) scale(0.50)">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#705622" stroke-width="2.5" stroke-opacity="0.35" />
        ${renderMarkGroup(calligraphy, "url(#umberBronze)")}
      </g>
      <line x1="560" y1="90" x2="560" y2="390" stroke="#705622" stroke-width="1.5" stroke-opacity="0.35" />
      <g transform="translate(620, 120)">
        <g transform="scale(1.35)"><path d="${calligraphy.latinWordmark.fullPath}" fill="#18181B" /></g>
        <g transform="translate(0, 85) scale(1.5)"><path d="${calligraphy.masterSloganAr.fullPath}" fill="#705622" /></g>
        <g transform="translate(0, 175) scale(1.15)"><path d="${calligraphy.masterSloganEn.fullPath}" fill="#7A756B" /></g>
      </g>
    </g>
    <rect x="0" y="280" width="680" height="50" rx="16" fill="#DFDAD0" />
    <g transform="translate(${340 - calligraphy.showcaseLabels.cardLockupLight.bounds.width * 0.5}, ${305 - calligraphy.showcaseLabels.cardLockupLight.bounds.height * 0.5})">
      <path d="${calligraphy.showcaseLabels.cardLockupLight.fullPath}" fill="#18181B" />
    </g>
  </g>
</svg>
`;
}

function generateAppIconShowcaseGridSVG(calligraphy: CalligraphyData): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
${SVG_GRADIENTS}
  <defs>
    <clipPath id="squircle1"><rect x="140" y="320" width="220" height="220" rx="50" ry="50" /></clipPath>
    <clipPath id="squircle2"><rect x="480" y="320" width="220" height="220" rx="50" ry="50" /></clipPath>
    <clipPath id="squircle3"><rect x="820" y="320" width="220" height="220" rx="50" ry="50" /></clipPath>
    <clipPath id="androidCircle"><circle cx="1270" cy="430" r="110" /></clipPath>
    <linearGradient id="tintedBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E2633" />
      <stop offset="100%" stop-color="#10151E" />
    </linearGradient>
  </defs>

  <rect width="1600" height="900" fill="#09090B" />

  <!-- Header -->
  <g transform="translate(800, 60)">
    <!-- Centered Latin Wordmark MISHKAAH -->
    <g transform="translate(${-calligraphy.latinWordmark.bounds.width * 0.5}, 0) scale(1.0)">
      <path d="${calligraphy.latinWordmark.fullPath}" fill="#F4F1EA" />
    </g>
    <!-- Hairline Divider -->
    <line x1="-120" y1="52" x2="120" y2="52" stroke="#C8A96A" stroke-width="1.2" stroke-opacity="0.4" />
    <!-- Centered Subtitle -->
    <g transform="translate(${-calligraphy.showcaseLabels.appIconSubtitle.bounds.width * 0.5}, 72)">
      <path d="${calligraphy.showcaseLabels.appIconSubtitle.fullPath}" fill="#8C7A5B" />
    </g>
  </g>

  <!-- 1. iOS 18 Dark -->
  <g clip-path="url(#squircle1)">
    <rect x="140" y="320" width="220" height="220" fill="#09090B" />
    <g transform="translate(140, 320) scale(0.2148)">
      ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
    </g>
  </g>
  <rect x="140" y="320" width="220" height="220" rx="50" ry="50" fill="none" stroke="#27272A" stroke-width="1.5" />
  <g transform="translate(${250 - calligraphy.showcaseLabels.cardIosDark.bounds.width * 0.5}, 570)"><path d="${calligraphy.showcaseLabels.cardIosDark.fullPath}" fill="#F4F1EA" /></g>
  <g transform="translate(${250 - calligraphy.showcaseLabels.subIosDark1.bounds.width * 0.5}, 596)"><path d="${calligraphy.showcaseLabels.subIosDark1.fullPath}" fill="#71717A" /></g>
  <g transform="translate(${250 - calligraphy.showcaseLabels.subIosDark2.bounds.width * 0.5}, 616)"><path d="${calligraphy.showcaseLabels.subIosDark2.fullPath}" fill="#C8A96A" /></g>

  <!-- 2. iOS 18 Light -->
  <g clip-path="url(#squircle2)">
    <rect x="480" y="320" width="220" height="220" fill="#F6F3EC" />
    <g transform="translate(480, 320) scale(0.2148)">
      ${renderMarkGroup(calligraphy, "url(#umberBronze)")}
    </g>
  </g>
  <rect x="480" y="320" width="220" height="220" rx="50" ry="50" fill="none" stroke="#E4E0D6" stroke-width="1.5" />
  <g transform="translate(${590 - calligraphy.showcaseLabels.cardIosLight.bounds.width * 0.5}, 570)"><path d="${calligraphy.showcaseLabels.cardIosLight.fullPath}" fill="#F4F1EA" /></g>
  <g transform="translate(${590 - calligraphy.showcaseLabels.subIosLight1.bounds.width * 0.5}, 596)"><path d="${calligraphy.showcaseLabels.subIosLight1.fullPath}" fill="#71717A" /></g>
  <g transform="translate(${590 - calligraphy.showcaseLabels.subIosLight2.bounds.width * 0.5}, 616)"><path d="${calligraphy.showcaseLabels.subIosLight2.fullPath}" fill="#C8A96A" /></g>

  <!-- 3. iOS 18 Tinted -->
  <g clip-path="url(#squircle3)">
    <rect x="820" y="320" width="220" height="220" fill="url(#tintedBg)" />
    <g transform="translate(820, 320) scale(0.2148)">
      ${renderMarkGroup(calligraphy, "#70A8FF")}
    </g>
  </g>
  <rect x="820" y="320" width="220" height="220" rx="50" ry="50" fill="none" stroke="#2C374A" stroke-width="1.5" />
  <g transform="translate(${930 - calligraphy.showcaseLabels.cardIosTinted.bounds.width * 0.5}, 570)"><path d="${calligraphy.showcaseLabels.cardIosTinted.fullPath}" fill="#F4F1EA" /></g>
  <g transform="translate(${930 - calligraphy.showcaseLabels.subIosTinted1.bounds.width * 0.5}, 596)"><path d="${calligraphy.showcaseLabels.subIosTinted1.fullPath}" fill="#71717A" /></g>
  <g transform="translate(${930 - calligraphy.showcaseLabels.subIosTinted2.bounds.width * 0.5}, 616)"><path d="${calligraphy.showcaseLabels.subIosTinted2.fullPath}" fill="#C8A96A" /></g>

  <!-- 4. Android Adaptive -->
  <g clip-path="url(#androidCircle)">
    <rect x="1160" y="320" width="220" height="220" fill="#09090B" />
    <g transform="translate(1160, 320) scale(0.2148)">
      ${renderMarkGroup(calligraphy, "url(#champagneGold)")}
    </g>
  </g>
  <circle cx="1270" cy="430" r="110" fill="none" stroke="#27272A" stroke-width="1.5" />
  <!-- 66dp Circular Safe Zone Guide Ring (r=67px in 220px icon) -->
  <circle cx="1270" cy="430" r="67" fill="none" stroke="#C8A96A" stroke-width="1" stroke-dasharray="4,4" stroke-opacity="0.6" />
  <g transform="translate(${1270 - calligraphy.showcaseLabels.cardAndroid.bounds.width * 0.5}, 570)"><path d="${calligraphy.showcaseLabels.cardAndroid.fullPath}" fill="#F4F1EA" /></g>
  <g transform="translate(${1270 - calligraphy.showcaseLabels.subAndroid1.bounds.width * 0.5}, 596)"><path d="${calligraphy.showcaseLabels.subAndroid1.fullPath}" fill="#71717A" /></g>
  <g transform="translate(${1270 - calligraphy.showcaseLabels.subAndroid2.bounds.width * 0.5}, 616)"><path d="${calligraphy.showcaseLabels.subAndroid2.fullPath}" fill="#C8A96A" /></g>

  <!-- Bottom Specs Banner -->
  <g transform="translate(800, 750)">
    <rect x="-420" y="-30" width="840" height="60" rx="30" fill="#121215" stroke="#27272A" stroke-width="1.2" />
    <g transform="translate(${-calligraphy.showcaseLabels.appIconBottomBanner.bounds.width * 0.5}, -6)">
      <path d="${calligraphy.showcaseLabels.appIconBottomBanner.fullPath}" fill="#F4F1EA" />
    </g>
  </g>
</svg>
`;
}


// Master Generator Execution
// =============================================================================

function generateAllVectors(): void {
  console.log("🚀 Starting Vector, Animated SVG, and Lottie Generation...");
  const brandRoot = join(import.meta.dir, "..");
  const calligraphyRaw = JSON.parse(
    readFileSync(join(brandRoot, "tokens", "calligraphy-paths.json"), "utf8"),
  );
  const calligraphy = CalligraphyDataSchema.parse(calligraphyRaw);

  // 1. Logos Directory
  const logosDir = join(brandRoot, "logos");
  console.log("  Writing static logo SVGs to logos/...");

  writeFileSync(join(logosDir, "mark-dark.svg"), generateMarkSVG(calligraphy, "dark"));
  writeFileSync(join(logosDir, "mark-light.svg"), generateMarkSVG(calligraphy, "light"));
  writeFileSync(join(logosDir, "mark-gold-transparent.svg"), generateMarkSVG(calligraphy, "gold-transparent"));
  writeFileSync(join(logosDir, "mark-bronze-transparent.svg"), generateMarkSVG(calligraphy, "bronze-transparent"));
  writeFileSync(join(logosDir, "mark-white-transparent.svg"), generateMarkSVG(calligraphy, "white-transparent"));
  writeFileSync(join(logosDir, "mark-black-transparent.svg"), generateMarkSVG(calligraphy, "black-transparent"));
  writeFileSync(join(logosDir, "lockup-horizontal-dark.svg"), generateHorizontalLockupSVG(calligraphy, "dark"));
  writeFileSync(join(logosDir, "lockup-horizontal-light.svg"), generateHorizontalLockupSVG(calligraphy, "light"));
  writeFileSync(join(logosDir, "monogram-dark.svg"), generateMonogramSVG(calligraphy, "dark"));
  writeFileSync(join(logosDir, "monogram-light.svg"), generateMonogramSVG(calligraphy, "light"));
  writeFileSync(join(logosDir, "monogram-gold-transparent.svg"), generateMonogramSVG(calligraphy, "gold-transparent"));
  writeFileSync(join(logosDir, "logo-showcase-grid.svg"), generateLogoShowcaseGridSVG(calligraphy));

  // Backward-compatible logo copies
  writeFileSync(join(logosDir, "mishkaah-mark-dark.svg"), generateMarkSVG(calligraphy, "dark"));
  writeFileSync(join(logosDir, "mishkaah-mark-gold-transparent.svg"), generateMarkSVG(calligraphy, "gold-transparent"));
  writeFileSync(join(logosDir, "mishkaah-monogram-dark.svg"), generateMonogramSVG(calligraphy, "dark"));

  // 2. App Icons Directory
  const appIconsDir = join(brandRoot, "app-icons");
  console.log("  Writing app-icon SVGs to app-icons/...");

  writeFileSync(join(appIconsDir, "ios-dark.svg"), generateAppIconSVG(calligraphy, "ios-dark"));
  writeFileSync(join(appIconsDir, "ios-light.svg"), generateAppIconSVG(calligraphy, "ios-light"));
  writeFileSync(join(appIconsDir, "ios-tinted.svg"), generateAppIconSVG(calligraphy, "ios-tinted"));
  writeFileSync(join(appIconsDir, "android-adaptive-foreground.svg"), generateAppIconSVG(calligraphy, "android-adaptive-foreground"));
  writeFileSync(join(appIconsDir, "android-adaptive-monochrome.svg"), generateAppIconSVG(calligraphy, "android-adaptive-monochrome"));
  writeFileSync(join(appIconsDir, "android-adaptive-background-dark.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><rect width="1024" height="1024" fill="#09090B"/></svg>\n`);
  writeFileSync(join(appIconsDir, "android-adaptive-background-light.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1024" height="1024"><rect width="1024" height="1024" fill="#F6F3EC"/></svg>\n`);
  writeFileSync(join(appIconsDir, "favicon.svg"), generateAppIconSVG(calligraphy, "favicon"));
  writeFileSync(join(appIconsDir, "app-icon-showcase-grid.svg"), generateAppIconShowcaseGridSVG(calligraphy));

  // Backward-compatible app-icon copies
  writeFileSync(join(appIconsDir, "app-icon-dark.svg"), generateAppIconSVG(calligraphy, "ios-dark"));
  writeFileSync(join(appIconsDir, "app-icon-light.svg"), generateAppIconSVG(calligraphy, "ios-light"));
  writeFileSync(join(appIconsDir, "app-icon-tinted.svg"), generateAppIconSVG(calligraphy, "ios-tinted"));

  // 3. Banners Directory
  const bannersDir = join(brandRoot, "banners");
  console.log("  Writing banner SVGs to banners/...");

  writeFileSync(join(bannersDir, "social-og-dark.svg"), generateSocialOgBannerSVG(calligraphy, "dark"));
  writeFileSync(join(bannersDir, "social-og-light.svg"), generateSocialOgBannerSVG(calligraphy, "light"));
  writeFileSync(join(bannersDir, "github-hero-dark.svg"), generateGithubHeroSVG(calligraphy, "dark"));
  writeFileSync(join(bannersDir, "github-hero-light.svg"), generateGithubHeroSVG(calligraphy, "light"));
  writeFileSync(join(bannersDir, "repo-banner-corpus.svg"), generateRepoBannerSVG(calligraphy, "corpus"));
  writeFileSync(join(bannersDir, "repo-banner-app.svg"), generateRepoBannerSVG(calligraphy, "app"));
  writeFileSync(join(bannersDir, "repo-banner-core.svg"), generateRepoBannerSVG(calligraphy, "core"));
  writeFileSync(join(bannersDir, "repo-banner-sdk.svg"), generateRepoBannerSVG(calligraphy, "sdk"));

  // Backward-compatible social banner
  writeFileSync(join(bannersDir, "mishkaah-social-banner.svg"), generateSocialOgBannerSVG(calligraphy, "dark"));

  // 4. Animated SVGs in animations/svg/
  const animSvgDir = join(brandRoot, "animations", "svg");
  console.log("  Writing animated SVGs to animations/svg/...");

  writeFileSync(join(animSvgDir, "mishkaah-reveal-dark.svg"), generateAnimatedRevealSVG(calligraphy, "dark"));
  writeFileSync(join(animSvgDir, "mishkaah-reveal-light.svg"), generateAnimatedRevealSVG(calligraphy, "light"));
  writeFileSync(join(animSvgDir, "mishkaah-emerge-dark.svg"), generateAnimatedEmergeSVG(calligraphy, "dark"));
  writeFileSync(join(animSvgDir, "mishkaah-emerge-light.svg"), generateAnimatedEmergeSVG(calligraphy, "light"));
  writeFileSync(join(animSvgDir, "mishkaah-hero-banner-animated.svg"), generateAnimatedHeroBannerSVG(calligraphy));
  writeFileSync(join(animSvgDir, "mishkaah-monogram-reveal-dark.svg"), generateAnimatedMonogramRevealSVG(calligraphy));

  // 5. Lottie Files in animations/lottie/
  const lottieDir = join(brandRoot, "animations", "lottie");
  console.log("  Writing Bodymovin Lottie files to animations/lottie/...");

  writeFileSync(
    join(lottieDir, "mishkaah-splash-reveal-dark.lottie.json"),
    JSON.stringify(generateLottieRevealJSON(calligraphy, "dark"), null, 2),
  );
  writeFileSync(
    join(lottieDir, "mishkaah-splash-reveal-light.lottie.json"),
    JSON.stringify(generateLottieRevealJSON(calligraphy, "light"), null, 2),
  );
  writeFileSync(
    join(lottieDir, "mishkaah-splash-emerge-dark.lottie.json"),
    JSON.stringify(generateLottieRevealJSON(calligraphy, "dark"), null, 2),
  );
  writeFileSync(
    join(lottieDir, "mishkaah-splash-emerge-light.lottie.json"),
    JSON.stringify(generateLottieRevealJSON(calligraphy, "light"), null, 2),
  );
  writeFileSync(
    join(lottieDir, "mishkaah-monogram-loader.lottie.json"),
    JSON.stringify(generateLottieMonogramLoaderJSON(calligraphy), null, 2),
  );

  // 6. Web Player Studio in animations/web-player/preview.html
  const webPlayerPath = join(brandRoot, "animations", "web-player", "preview.html");
  writeFileSync(webPlayerPath, generateWebPlayerHTML(calligraphy));

  console.log("✨ Successfully generated all vector SVGs, animated SVGs, Lottie files, and HTML5 Web Player Studio!");
}

generateAllVectors();
