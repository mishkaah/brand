import * as fs from "node:fs";
import * as path from "node:path";

const BRAND_ROOT = path.resolve(import.meta.dir, "..");
let errorCount = 0;

function reportError(msg: string): void {
  console.error(`❌ [INTEGRITY ERROR]: ${msg}`);
  errorCount++;
}

console.log("🔍 Running Mishkaah Brand Integrity Suite...");

// 1. Verify JSON Token Validity
const tokenFiles = [
  "colors.json",
  "typography.json",
  "slogans.json",
  "motion.json",
  "calligraphy-paths.json",
];
for (const file of tokenFiles) {
  const filePath = path.join(BRAND_ROOT, "tokens", file);
  if (!fs.existsSync(filePath)) {
    reportError(`Missing design token file: tokens/${file}`);
    continue;
  }
  try {
    JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    reportError(`Invalid JSON in tokens/${file}: ${msg}`);
  }
}

// 2. Verify Zero Font Dependency (<text> tags banned in core brand SVGs)
function checkSvgFiles(dir: string): void {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== ".git" && entry.name !== "node_modules") {
      checkSvgFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".svg")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (/<text\b/i.test(content)) {
        reportError(
          `Forbidden <text> tag found in SVG "${path.relative(BRAND_ROOT, fullPath)}". Must use pure Bezier <path> outlines.`,
        );
      }
    }
  }
}
checkSvgFiles(BRAND_ROOT);

// 3. Verify Bilingual Markdown Pairing
const directoriesToPair = [
  "",
  "logos",
  "app-icons",
  "banners",
  "animations",
  "tokens",
  "docs",
  "scripts",
];

for (const dir of directoriesToPair) {
  const enReadme = path.join(BRAND_ROOT, dir, "README.md");
  const arReadme = path.join(BRAND_ROOT, dir, "README.ar.md");
  if (!fs.existsSync(enReadme)) {
    reportError(`Missing English README in "${dir || "root"}": README.md`);
  }
  if (!fs.existsSync(arReadme)) {
    reportError(`Missing Arabic companion in "${dir || "root"}": README.ar.md`);
  }
}

// 4. Verify Ban on LaTeX Math Blocks ($ or $$) in Markdown files
function checkMarkdownFiles(dir: string): void {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== ".git" && entry.name !== "node_modules") {
      checkMarkdownFiles(fullPath);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      const content = fs.readFileSync(fullPath, "utf-8");
      const lines = content.split("\n");
      let inCode = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? "";
        if (line.trim().startsWith("```")) {
          inCode = !inCode;
          continue;
        }
        if (inCode) continue;
        const lineWithoutInline = line.replace(/`[^`]*`/g, "");
        if (lineWithoutInline.includes("$")) {
          reportError(
            `Banned math block character ($) in ${path.relative(BRAND_ROOT, fullPath)}:${i + 1}`,
          );
        }
      }
    }
  }
}
checkMarkdownFiles(BRAND_ROOT);

// 5. Verify Generated Token Distribution
const distFiles = [
  "tokens/dist/tokens.css",
  "tokens/dist/tokens.ts",
  "tokens/dist/mishkaah_tokens.dart",
];
for (const df of distFiles) {
  const fullPath = path.join(BRAND_ROOT, df);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size < 100) {
    reportError(`Missing or empty token distribution file: ${df}`);
  }
}

// 6. Verify Critical Deliverables (Logos, App Icons, Banners, Presentations)
const criticalDeliverables = [
  "logos/mark-dark.svg",
  "logos/mark-dark.png",
  "logos/mark-dark.webp",
  "logos/mark-light.svg",
  "logos/mark-light.png",
  "logos/mark-light.webp",
  "logos/logo-showcase-grid.svg",
  "logos/logo-showcase-grid.png",
  "logos/logo-showcase-grid.webp",
  "app-icons/ios-dark.svg",
  "app-icons/ios-dark.png",
  "app-icons/ios-dark.webp",
  "app-icons/android-adaptive-foreground.svg",
  "app-icons/android-adaptive-foreground.png",
  "app-icons/favicon.ico",
  "app-icons/apple-touch-icon.png",
  "app-icons/app-icon-showcase-grid.svg",
  "app-icons/app-icon-showcase-grid.png",
  "banners/social-og-dark.svg",
  "banners/social-og-dark.png",
  "banners/github-hero-dark.svg",
  "banners/github-hero-dark.png",
  "banners/repo-banner-corpus.svg",
  "banners/repo-banner-corpus.png",
  "banners/repo-banner-app.svg",
  "banners/repo-banner-core.svg",
  "banners/repo-banner-sdk.svg",
  "animations/svg/mishkaah-reveal-dark.svg",
  "animations/svg/mishkaah-emerge-dark.svg",
  "animations/svg/mishkaah-hero-banner-animated.svg",
  "animations/lottie/mishkaah-splash-reveal-dark.lottie.json",
  "animations/lottie/mishkaah-splash-reveal-light.lottie.json",
  "animations/lottie/mishkaah-monogram-loader.lottie.json",
  "animations/web-player/preview.html",
  "animations/video/mishkaah-intro-16x9-dark.mp4",
  "animations/video/mishkaah-intro-16x9-dark.webm",
  "animations/video/mishkaah-reveal-1x1-dark.mp4",
  "animations/video/mishkaah-reveal-1x1-dark.webp",
  "docs/presentations/mishkaah-brand-book.pdf",
  "docs/presentations/brand-identity-sheet.png",
];

for (const cd of criticalDeliverables) {
  const fullPath = path.join(BRAND_ROOT, cd);
  if (!fs.existsSync(fullPath)) {
    reportError(`Missing critical deliverable: ${cd}`);
  } else if (fs.statSync(fullPath).size === 0) {
    reportError(`Zero-byte critical deliverable: ${cd}`);
  }
}

// 7. Verify PDF Header Integrity
const pdfFullPath = path.join(BRAND_ROOT, "docs/presentations/mishkaah-brand-book.pdf");
if (fs.existsSync(pdfFullPath)) {
  const buf = fs.readFileSync(pdfFullPath);
  if (buf.toString("latin1", 0, 5) !== "%PDF-") {
    reportError("docs/presentations/mishkaah-brand-book.pdf is not a valid PDF file.");
  }
}

if (errorCount === 0) {
  console.log("✅ All brand integrity checks passed successfully (0 errors).");
  process.exit(0);
} else {
  console.error(`❌ Total brand integrity errors: ${errorCount}`);
  process.exit(1);
}
