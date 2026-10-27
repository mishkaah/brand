import { execSync } from "node:child_process";
import { join } from "node:path";

function step(title: string, cmd: string): void {
  console.log(`\n======================================================================`);
  console.log(`▶ STEP: ${title}`);
  console.log(`  Running: ${cmd}`);
  console.log(`======================================================================`);
  execSync(cmd, { stdio: "inherit", cwd: join(import.meta.dir, "..") });
}

console.log("🏛️ Starting Mishkaah Complete Brand Build Pipeline...");
const startTime = performance.now();

// 1. Extract Calligraphy Bezier Paths via Swift & CoreText
step("CoreText Calligraphy Path Extraction", "swift scripts/extract-calligraphy-paths.swift");

// 2. Generate Design Tokens Distribution (CSS, TypeScript, Dart)
step("Design Tokens Distribution", "bun run scripts/generate-tokens-dist.ts");

// 3. Generate Vector SVGs, Animated SVGs, Lottie Files, and HTML5 Studio
step("Vector SVGs & Lottie Animations", "bun run scripts/generate-vectors-and-tokens.ts");

// 4. Render Rasters, Videos, and Presentations
step("Rasters, 60fps Videos & PDF Brand Book", "bun run scripts/render-rasters-and-videos.ts");

const elapsed = ((performance.now() - startTime) / 1000).toFixed(1);
console.log(`\n🎉 Full Mishkaah Brand Build Pipeline Completed Successfully in ${elapsed}s!`);
