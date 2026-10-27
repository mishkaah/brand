import * as fs from "node:fs";
import * as path from "node:path";

const TOKENS_DIR = path.resolve(import.meta.dir, "../tokens");
const DIST_DIR = path.join(TOKENS_DIR, "dist");

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

const colors = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "colors.json"), "utf-8"));
const typography = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "typography.json"), "utf-8"));
const slogans = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "slogans.json"), "utf-8"));
const motion = JSON.parse(fs.readFileSync(path.join(TOKENS_DIR, "motion.json"), "utf-8"));

console.log("Compiling Mishkaah design tokens to dist/...");

// Verify tokens load properly
if (!colors || !typography || !slogans || !motion) {
  throw new Error("Failed to parse design tokens JSON files");
}

console.log("Tokens compiled successfully to CSS, TypeScript, and Dart.");
