import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { chromium, type Browser } from "playwright";

// =============================================================================
// Helper: Execute shell commands deterministically
// =============================================================================

function runCmd(cmd: string): void {
  try {
    execSync(cmd, { stdio: "pipe" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Command failed: ${cmd}\nError: ${message}`);
    throw err;
  }
}

// =============================================================================
// Part 1: Render Crisp Raster Exports (.png & .webp) via Playwright + ImageMagick
// =============================================================================

interface SvgTarget {
  svgPath: string;
  pngPath: string;
  webpPath: string;
  width: number;
  height: number;
  transparent: boolean;
}

async function renderStaticRasters(browser: Browser, brandRoot: string): Promise<void> {
  console.log("🎨 Rendering Static High-Resolution Rasters (.png & .webp)...");

  const targets: SvgTarget[] = [
    // Logos (1024x1024)
    {
      svgPath: join(brandRoot, "logos", "mark-dark.svg"),
      pngPath: join(brandRoot, "logos", "mark-dark.png"),
      webpPath: join(brandRoot, "logos", "mark-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "mark-light.svg"),
      pngPath: join(brandRoot, "logos", "mark-light.png"),
      webpPath: join(brandRoot, "logos", "mark-light.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "mark-gold-transparent.svg"),
      pngPath: join(brandRoot, "logos", "mark-gold-transparent.png"),
      webpPath: join(brandRoot, "logos", "mark-gold-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "mark-bronze-transparent.svg"),
      pngPath: join(brandRoot, "logos", "mark-bronze-transparent.png"),
      webpPath: join(brandRoot, "logos", "mark-bronze-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "mark-white-transparent.svg"),
      pngPath: join(brandRoot, "logos", "mark-white-transparent.png"),
      webpPath: join(brandRoot, "logos", "mark-white-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "mark-black-transparent.svg"),
      pngPath: join(brandRoot, "logos", "mark-black-transparent.png"),
      webpPath: join(brandRoot, "logos", "mark-black-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "lockup-horizontal-dark.svg"),
      pngPath: join(brandRoot, "logos", "lockup-horizontal-dark.png"),
      webpPath: join(brandRoot, "logos", "lockup-horizontal-dark.webp"),
      width: 1600,
      height: 480,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "lockup-horizontal-light.svg"),
      pngPath: join(brandRoot, "logos", "lockup-horizontal-light.png"),
      webpPath: join(brandRoot, "logos", "lockup-horizontal-light.webp"),
      width: 1600,
      height: 480,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "monogram-dark.svg"),
      pngPath: join(brandRoot, "logos", "monogram-dark.png"),
      webpPath: join(brandRoot, "logos", "monogram-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "monogram-light.svg"),
      pngPath: join(brandRoot, "logos", "monogram-light.png"),
      webpPath: join(brandRoot, "logos", "monogram-light.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "monogram-gold-transparent.svg"),
      pngPath: join(brandRoot, "logos", "monogram-gold-transparent.png"),
      webpPath: join(brandRoot, "logos", "monogram-gold-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "logo-showcase-grid.svg"),
      pngPath: join(brandRoot, "logos", "logo-showcase-grid.png"),
      webpPath: join(brandRoot, "logos", "logo-showcase-grid.webp"),
      width: 1600,
      height: 1000,
      transparent: false,
    },
    // Backward-compatible logos
    {
      svgPath: join(brandRoot, "logos", "mishkaah-mark-dark.svg"),
      pngPath: join(brandRoot, "logos", "mishkaah-mark-dark.png"),
      webpPath: join(brandRoot, "logos", "mishkaah-mark-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "logos", "mishkaah-mark-gold-transparent.svg"),
      pngPath: join(brandRoot, "logos", "mishkaah-mark-gold-transparent.png"),
      webpPath: join(brandRoot, "logos", "mishkaah-mark-gold-transparent.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "logos", "mishkaah-monogram-dark.svg"),
      pngPath: join(brandRoot, "logos", "mishkaah-monogram-dark.png"),
      webpPath: join(brandRoot, "logos", "mishkaah-monogram-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },

    // App Icons (1024x1024, Favicon 512x512, Showcase 1600x900)
    {
      svgPath: join(brandRoot, "app-icons", "ios-dark.svg"),
      pngPath: join(brandRoot, "app-icons", "ios-dark.png"),
      webpPath: join(brandRoot, "app-icons", "ios-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "ios-light.svg"),
      pngPath: join(brandRoot, "app-icons", "ios-light.png"),
      webpPath: join(brandRoot, "app-icons", "ios-light.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "ios-tinted.svg"),
      pngPath: join(brandRoot, "app-icons", "ios-tinted.png"),
      webpPath: join(brandRoot, "app-icons", "ios-tinted.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "app-icons", "android-adaptive-foreground.svg"),
      pngPath: join(brandRoot, "app-icons", "android-adaptive-foreground.png"),
      webpPath: join(brandRoot, "app-icons", "android-adaptive-foreground.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "app-icons", "android-adaptive-monochrome.svg"),
      pngPath: join(brandRoot, "app-icons", "android-adaptive-monochrome.png"),
      webpPath: join(brandRoot, "app-icons", "android-adaptive-monochrome.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },
    {
      svgPath: join(brandRoot, "app-icons", "android-adaptive-background-dark.svg"),
      pngPath: join(brandRoot, "app-icons", "android-adaptive-background-dark.png"),
      webpPath: join(brandRoot, "app-icons", "android-adaptive-background-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "android-adaptive-background-light.svg"),
      pngPath: join(brandRoot, "app-icons", "android-adaptive-background-light.png"),
      webpPath: join(brandRoot, "app-icons", "android-adaptive-background-light.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "app-icon-showcase-grid.svg"),
      pngPath: join(brandRoot, "app-icons", "app-icon-showcase-grid.png"),
      webpPath: join(brandRoot, "app-icons", "app-icon-showcase-grid.webp"),
      width: 1600,
      height: 900,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "favicon.svg"),
      pngPath: join(brandRoot, "app-icons", "favicon.png"),
      webpPath: join(brandRoot, "app-icons", "favicon.webp"),
      width: 512,
      height: 512,
      transparent: false,
    },
    // Backward-compatible app icons
    {
      svgPath: join(brandRoot, "app-icons", "app-icon-dark.svg"),
      pngPath: join(brandRoot, "app-icons", "app-icon-dark.png"),
      webpPath: join(brandRoot, "app-icons", "app-icon-dark.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "app-icon-light.svg"),
      pngPath: join(brandRoot, "app-icons", "app-icon-light.png"),
      webpPath: join(brandRoot, "app-icons", "app-icon-light.webp"),
      width: 1024,
      height: 1024,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "app-icons", "app-icon-tinted.svg"),
      pngPath: join(brandRoot, "app-icons", "app-icon-tinted.png"),
      webpPath: join(brandRoot, "app-icons", "app-icon-tinted.webp"),
      width: 1024,
      height: 1024,
      transparent: true,
    },

    // Banners
    {
      svgPath: join(brandRoot, "banners", "social-og-dark.svg"),
      pngPath: join(brandRoot, "banners", "social-og-dark.png"),
      webpPath: join(brandRoot, "banners", "social-og-dark.webp"),
      width: 1280,
      height: 640,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "social-og-light.svg"),
      pngPath: join(brandRoot, "banners", "social-og-light.png"),
      webpPath: join(brandRoot, "banners", "social-og-light.webp"),
      width: 1280,
      height: 640,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "github-hero-dark.svg"),
      pngPath: join(brandRoot, "banners", "github-hero-dark.png"),
      webpPath: join(brandRoot, "banners", "github-hero-dark.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "github-hero-light.svg"),
      pngPath: join(brandRoot, "banners", "github-hero-light.png"),
      webpPath: join(brandRoot, "banners", "github-hero-light.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "repo-banner-corpus.svg"),
      pngPath: join(brandRoot, "banners", "repo-banner-corpus.png"),
      webpPath: join(brandRoot, "banners", "repo-banner-corpus.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "repo-banner-app.svg"),
      pngPath: join(brandRoot, "banners", "repo-banner-app.png"),
      webpPath: join(brandRoot, "banners", "repo-banner-app.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "repo-banner-core.svg"),
      pngPath: join(brandRoot, "banners", "repo-banner-core.png"),
      webpPath: join(brandRoot, "banners", "repo-banner-core.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "repo-banner-sdk.svg"),
      pngPath: join(brandRoot, "banners", "repo-banner-sdk.png"),
      webpPath: join(brandRoot, "banners", "repo-banner-sdk.webp"),
      width: 1600,
      height: 500,
      transparent: false,
    },
    {
      svgPath: join(brandRoot, "banners", "mishkaah-social-banner.svg"),
      pngPath: join(brandRoot, "banners", "mishkaah-social-banner.png"),
      webpPath: join(brandRoot, "banners", "mishkaah-social-banner.webp"),
      width: 1280,
      height: 640,
      transparent: false,
    },
  ];

  for (const t of targets) {
    if (!existsSync(t.svgPath)) {
      console.warn(`  ⚠️ SVG not found: ${t.svgPath}`);
      continue;
    }

    const svgContent = readFileSync(t.svgPath, "utf8");
    const page = await browser.newPage({
      viewport: { width: t.width, height: t.height },
      deviceScaleFactor: 1,
    });

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: ${t.transparent ? "transparent" : "#09090B"}; }
    svg { display: block; width: 100%; height: 100%; }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;

    await page.setContent(html);
    await page.screenshot({ path: t.pngPath, omitBackground: t.transparent });
    await page.close();

    // Convert to .webp using ImageMagick
    runCmd(`magick "${t.pngPath}" "${t.webpPath}"`);
    console.log(`  ✓ Rendered ${t.pngPath} & .webp (${t.width}×${t.height})`);
  }

  // Generate multi-size favicon.ico (16, 32, 48) via magick
  const faviconPng = join(brandRoot, "app-icons", "favicon.png");
  const faviconIco = join(brandRoot, "app-icons", "favicon.ico");
  runCmd(`magick "${faviconPng}" -define icon:auto-resize=48,32,16 "${faviconIco}"`);
  console.log("  ✓ Generated multi-size app-icons/favicon.ico (16, 32, 48)");

  // Generate apple-touch-icon.png (180x180) via magick
  const iosDarkPng = join(brandRoot, "app-icons", "ios-dark.png");
  const appleTouchIconPng = join(brandRoot, "app-icons", "apple-touch-icon.png");
  runCmd(`magick "${iosDarkPng}" -resize 180x180 "${appleTouchIconPng}"`);
  console.log("  ✓ Generated app-icons/apple-touch-icon.png (180×180)");
}

// =============================================================================
// Part 2: Render 8-Page Brand Identity Book PDF & Executive Sheet
// =============================================================================

async function renderBrandBookAndSheet(browser: Browser, brandRoot: string): Promise<void> {
  console.log("📖 Rendering 8-Page Mishkaah Brand Identity Book PDF...");

  const pdfPath = join(brandRoot, "docs", "presentations", "mishkaah-brand-book.pdf");
  const bentoSheetPng = join(brandRoot, "docs", "presentations", "brand-identity-sheet.png");

  // Read calligraphy paths JSON for inline embedding in slides
  const calligraphyRaw = JSON.parse(
    readFileSync(join(brandRoot, "tokens", "calligraphy-paths.json"), "utf8"),
  );
  const markD = calligraphyRaw.primaryMark.fullPath;
  const monoD = calligraphyRaw.monogram.fullPath;
  const latinD = calligraphyRaw.latinWordmark.fullPath;
  const sloganArD = calligraphyRaw.masterSloganAr.fullPath;
  const sloganEnD = calligraphyRaw.masterSloganEn.fullPath;

  function renderMarkGroup(primaryMark: { rasm: Array<{ d: string }>; tashkeel: Array<{ d: string }> }, fillExpr: string, extraAttrs = ""): string {
    const attrs = extraAttrs ? ` ${extraAttrs}` : "";
    const contours = [...primaryMark.rasm, ...primaryMark.tashkeel];
    return `<g fill="${fillExpr}" fill-rule="nonzero"${attrs}>\n` +
      contours.map((p) => `    <path d="${p.d}" />`).join("\n") +
      `\n  </g>`;
  }

  // 8 Slides HTML in 1600x900 Landscape Format
  const brandBookHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    @page { size: 1600px 900px; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #09090B;
      color: #F4F1EA;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .slide {
      width: 1600px;
      height: 900px;
      page-break-after: always;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 80px 100px;
      background: #09090B;
    }
    .slide.light {
      background: #F6F3EC;
      color: #18181B;
    }
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(200, 169, 106, 0.25);
      padding-bottom: 24px;
    }
    .slide-header h2 {
      font-size: 24px;
      font-weight: 500;
      color: #C8A96A;
      letter-spacing: 1px;
    }
    .slide.light .slide-header h2 {
      color: #705622;
    }
    .slide-header .tag {
      font-size: 13px;
      letter-spacing: 3px;
      color: #71717A;
    }
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid rgba(200, 169, 106, 0.15);
      padding-top: 20px;
      font-size: 12px;
      color: #71717A;
      letter-spacing: 2px;
    }
    .slide-body {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 0;
    }
    .cover-content {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .grid-2col {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      width: 100%;
      height: 100%;
      align-items: center;
    }
    .card {
      background: #121215;
      border: 1px solid #27272A;
      border-radius: 20px;
      padding: 36px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .slide.light .card {
      background: #EDEAE1;
      border-color: #E4E0D6;
    }
    .card h3 {
      font-size: 20px;
      color: #C8A96A;
      margin-bottom: 16px;
    }
    .slide.light .card h3 {
      color: #705622;
    }
    .card p {
      font-size: 15px;
      line-height: 1.8;
      color: #A1A1AA;
    }
    .slide.light .card p {
      color: #52525B;
    }
    .swatch {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 12px;
    }
    .swatch-box {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>

  <!-- SLIDE 1: COVER -->
  <div class="slide">
    <div class="slide-header">
      <h2>مِشْكَاة · دَلِيلُ الْهُوِيَّةِ الْبَصَرِيَّة</h2>
      <span class="tag">MISHKAAH BRAND IDENTITY SYSTEM · v2.2.0</span>
    </div>
    <div class="slide-body">
      <div class="cover-content">
        <svg viewBox="0 0 1024 1024" width="380" height="380">
          <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.28" />
          ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#goldGrad)")}
          <defs>
            <linearGradient id="goldGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
              <stop offset="0%" stop-color="#E5CFA0" />
              <stop offset="100%" stop-color="#B89655" />
            </linearGradient>
            <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
              <stop offset="0%" stop-color="#8A6B2F" />
              <stop offset="100%" stop-color="#553F16" />
            </linearGradient>
          </defs>
        </svg>
        <div style="margin-top: 30px;">
          <svg viewBox="0 0 350 35" width="280">
            <path d="${latinD}" fill="#F4F1EA" />
          </svg>
        </div>
        <div style="margin-top: 20px;">
          <svg viewBox="0 0 240 40" width="300">
            <path d="${sloganArD}" fill="#C8A96A" />
          </svg>
        </div>
        <div style="margin-top: 10px;">
          <svg viewBox="0 0 550 15" width="440">
            <path d="${sloganEnD}" fill="#71717A" />
          </svg>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>الدَّوْلَةُ الْعِلْمِيَّةُ لِلْمُدَوَّنَةِ الإِسْلَامِيَّة</span>
      <span>OFFICIAL BRAND SPECIFICATION BOOK · SLIDE 1 / 8</span>
    </div>
  </div>

  <!-- SLIDE 2: BRAND PHILOSOPHY -->
  <div class="slide">
    <div class="slide-header">
      <h2>فَلْسَفَةُ الْهُوِيَّةِ وَالْمُرْتَكَزُ الرُّوحِيّ</h2>
      <span class="tag">01 · BRAND PHILOSOPHY &amp; SPIRITUAL ANCHOR</span>
    </div>
    <div class="slide-body">
      <div class="grid-2col">
        <div class="card">
          <h3>آيَةُ النُّور (النور: ٣٥)</h3>
          <p style="font-size: 18px; line-height: 2.0; color: #E5CFA0; margin-bottom: 20px;">
            ﴿اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ ۚ مَثَلُ نُورِهِ كَمِشْكَاةٍ فِيهَا مِصْبَاحٌ ۖ الْمِصْبَاحُ فِي زُجَاجَةٍ ۖ الزُّجَاجَةُ كَأَنَّهَا كَوْكَبٌ دُرِّيٌّ﴾
          </p>
          <p>
            تستمد <b>مِشْكَاة</b> جوهرها ورسالتها من التجلي المعماري القرآني: الحنية الجدارية الحافظة للنور من التبدد. نقوم على صون التراث المحقق ورقمنته بحياد هندسي صارم، موثق بأسانيد التحقيق وطبقات الروايات المعتمدة.
          </p>
        </div>
        <div class="card">
          <h3>الرَّكَائِزُ الْهَنْدَسِيَّةُ الأَرْبَع</h3>
          <p style="margin-bottom: 12px;"><b style="color:#C8A96A">١. الْمُدَوَّنَة (Corpus):</b> نصوص مضبوطة بالشكل التام خالية من التحريف.</p>
          <p style="margin-bottom: 12px;"><b style="color:#C8A96A">٢. النَّوَاة (Core):</b> خوارزميات التدقيق الرياضي والتحقق الصارم.</p>
          <p style="margin-bottom: 12px;"><b style="color:#C8A96A">٣. الْحَقِيبَة (SDK):</b> أدوات للمطورين والباحثين لحل المعرفات الموحدة.</p>
          <p><b style="color:#C8A96A">٤. التَّطْبِيق (Reader App):</b> بيئة قراءة خاشعة هادئة تليق بالنص الشريف.</p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>مِشْكَاة: صَرْحٌ عِلْمِيٌّ مُحَقَّق</span>
      <span>SLIDE 2 / 8</span>
    </div>
  </div>

  <!-- SLIDE 3: PRIMARY MARK ANATOMY -->
  <div class="slide">
    <div class="slide-header">
      <h2>تَشْرِيحُ الشِّعَارِ الْخَطِّيِّ السِّيَادِيّ</h2>
      <span class="tag">02 · PRIMARY CALLIGRAPHIC MARK ANATOMY</span>
    </div>
    <div class="slide-body">
      <div class="grid-2col">
        <div style="display:flex; justify-content:center;">
          <svg viewBox="0 0 1024 1024" width="440" height="440">
            <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.35" />
            ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#goldGrad)")}
            <!-- Clear-space annotations -->
            <circle cx="512" cy="512" r="460" fill="none" stroke="#71717A" stroke-width="1" stroke-dasharray="6,6" stroke-opacity="0.4" />
          </svg>
        </div>
        <div class="card">
          <h3>هَنْدَسَةُ الْخَطِّ وَالتَّشْكِيل</h3>
          <p style="margin-bottom: 16px;">
            <b>١. رَسْمُ الْحُرُوف (Rasm):</b> خُطَّ اسم «مِشْكَاة» بخط الثلث الديواني الأصيل، مُمتازاً بقوس الكاف السابغ الذي يحتضن التاء المربوطة ويحرس التشكيل.
          </p>
          <p style="margin-bottom: 16px;">
            <b>٢. عَلَامَاتُ التَّشْكِيل (Tashkeel):</b> فُصِل التشكيل هندسياً (كسرة الميم، نقاط الشين، سكون الشين، فتحة الكاف، نقطتا التاء) لتوفير دقة تحريك استثنائية متدرجة.
          </p>
          <p>
            <b>٣. الْمَدَارُ الْفَلَكِيّ (Orbit):</b> حلقة دائرية نحيفة (1.5px) بقطر 720px تُحيط بالخط في صمت متحفي وهدوء روحي.
          </p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>خَطُّ الثُّلُثِ الدِّيوَانِيِّ الْمُحَقَّق</span>
      <span>SLIDE 3 / 8</span>
    </div>
  </div>

  <!-- SLIDE 4: MONOGRAM & LOCKUPS -->
  <div class="slide">
    <div class="slide-header">
      <h2>مُونُوغْرَامُ الْمِيمِ وَالتَّرْكِيبُ الأُفُقِيّ</h2>
      <span class="tag">03 · MONOGRAM (MEEM) &amp; HORIZONTAL LOCKUPS</span>
    </div>
    <div class="slide-body">
      <div class="grid-2col">
        <div class="card" style="align-items:center; text-align:center;">
          <svg viewBox="0 0 1024 1024" width="260" height="260">
            <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.30" />
            <path d="${monoD}" fill="url(#goldGrad)" fill-rule="nonzero" />
          </svg>
          <h3 style="margin-top:16px;">مُونُوغْرَامُ الْمِيمِ السِّيَادِيّ</h3>
          <p>مخصص لأيقونات التحميل، وأختام التوثيق، والمساحات المصغرة.</p>
        </div>
        <div class="card">
          <h3>التَّرْكِيبُ الأُفُقِيُّ الْمُوَحَّد</h3>
          <div style="background:#09090B; border:1px solid #27272A; border-radius:12px; padding:20px; margin-bottom:16px;">
            <svg viewBox="0 0 1600 480" width="100%">
              <defs>
                <linearGradient id="goldGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
                  <stop offset="0%" stop-color="#E5CFA0" />
                  <stop offset="100%" stop-color="#B89655" />
                </linearGradient>
                <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
                  <stop offset="0%" stop-color="#8A6B2F" />
                  <stop offset="100%" stop-color="#553F16" />
                </linearGradient>
              </defs>
              <g transform="translate(${280 - 512 * 0.52}, ${240 - 512 * 0.52}) scale(0.52)">
                <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2.5" stroke-opacity="0.30" />
                ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#goldGrad)")}
              </g>
              <line x1="560" y1="90" x2="560" y2="390" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.35" />
              <g transform="translate(630, 110)">
                <g transform="translate(0, 0)"><path d="${latinD}" fill="#F4F1EA" /></g>
                <g transform="translate(0, 100)"><path d="${sloganArD}" fill="#C8A96A" /></g>
                <g transform="translate(0, 205)"><path d="${sloganEnD}" fill="#8C7A5B" /></g>
              </g>
            </svg>
          </div>
          <p>توازن بصري دقيق يجمع الرمز الخطي الأصيل، والاسم اللاتيني، والشعار المعتمد.</p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>تَكَامُلُ الْعَنَاصِرِ الْبَصَرِيَّة</span>
      <span>SLIDE 4 / 8</span>
    </div>
  </div>

  <!-- SLIDE 5: SLOGAN SYSTEM -->
  <div class="slide">
    <div class="slide-header">
      <h2>مَنْظُومَةُ الشِّعَارَاتِ وَالأَرْكَانِ الأَرْبَعَة</h2>
      <span class="tag">04 · BILINGUAL SLOGANS ACROSS THE 4 PILLARS</span>
    </div>
    <div class="slide-body">
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 24px; width:100%;">
        <div class="card">
          <h3>١. الشِّعَارُ السِّيَادِيُّ الأُمّ</h3>
          <p style="font-size:18px; color:#F4F1EA; margin-bottom:6px;">«نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون»</p>
          <p style="letter-spacing:1px; color:#C8A96A;">Preserved Text. Trusted Knowledge.</p>
        </div>
        <div class="card">
          <h3>٢. رُكْنُ الْمُدَوَّنَة (Corpus)</h3>
          <p style="font-size:18px; color:#F4F1EA; margin-bottom:6px;">«نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون»</p>
          <p style="letter-spacing:1px; color:#C8A96A;">Preserved Text. Trusted Knowledge.</p>
        </div>
        <div class="card">
          <h3>٣. رُكْنُ التَّطْبِيق (Reader App)</h3>
          <p style="font-size:18px; color:#F4F1EA; margin-bottom:6px;">«نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون»</p>
          <p style="letter-spacing:1px; color:#C8A96A;">Preserved Text. Trusted Knowledge.</p>
        </div>
        <div class="card">
          <h3>٤. رُكْنُ النَّوَاة وَالْحَقِيبَة (Core &amp; SDK)</h3>
          <p style="font-size:18px; color:#F4F1EA; margin-bottom:6px;">«نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون»</p>
          <p style="letter-spacing:1px; color:#C8A96A;">Preserved Text. Trusted Knowledge.</p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>بَلَاغَةُ الْعِبَارَةِ وَوُضُوحُ الْمَقْصِد</span>
      <span>SLIDE 5 / 8</span>
    </div>
  </div>

  <!-- SLIDE 6: CHROMATIC DUALITY -->
  <div class="slide">
    <div class="slide-header">
      <h2>الثُّنَائِيَّةُ اللَّوْنِيَّةُ وَشَارَاتُ التَّوْثِيقِ الْحَدِيثِيّ</h2>
      <span class="tag">05 · CHROMATIC DUALITY &amp; HADITH AUTHENTICITY TOKENS</span>
    </div>
    <div class="slide-body">
      <div class="grid-2col">
        <div class="card">
          <h3>أَلْوَانُ الأَرْضِيَّةِ وَالْخَطّ</h3>
          <div class="swatch">
            <div class="swatch-box" style="background:#09090B;"></div>
            <div><b>الأسود المطفي (Matte Obsidian)</b><br><span style="color:#71717A;">#09090B · الخلفية الداكنة الافتراضية</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:#F6F3EC; border-color:#DDD;"></div>
            <div><b>بياض الورق (Warm Alabaster)</b><br><span style="color:#71717A;">#F6F3EC · أرضية القراءة النهارية</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:linear-gradient(135deg, #E5CFA0, #B89655);"></div>
            <div><b>الذهب التراثي (Champagne Gold)</b><br><span style="color:#C8A96A;">تباين 11.4:1 على الأسود (WCAG AAA)</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:linear-gradient(135deg, #8A6B2F, #553F16);"></div>
            <div><b>الحبر التراثي (Umber Bronze)</b><br><span style="color:#C8A96A;">تباين 12.8:1 على الورق (WCAG AAA)</span></div>
          </div>
        </div>
        <div class="card">
          <h3>شَارَاتُ دَرَجَاتِ الْحَدِيثِ الشَّرِيف</h3>
          <div class="swatch">
            <div class="swatch-box" style="background:#10B981;"></div>
            <div><b style="color:#10B981;">صَحِيح (Sahih)</b><br><span style="color:#71717A;">#10B981 · شارة الحديث الصحيح المتصل</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:#3B82F6;"></div>
            <div><b style="color:#3B82F6;">حَسَن (Hasan)</b><br><span style="color:#71717A;">#3B82F6 · شارة الحديث الحسن المقبول</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:#F59E0B;"></div>
            <div><b style="color:#F59E0B;">ضَعِيف (Da'if)</b><br><span style="color:#71717A;">#F59E0B · شارة الحديث الضعيف المنبه عليه</span></div>
          </div>
          <div class="swatch">
            <div class="swatch-box" style="background:#EF4444;"></div>
            <div><b style="color:#EF4444;">تَنْبِيه / تَحْقِيق (Alert)</b><br><span style="color:#71717A;">#EF4444 · استدراك علمي أو فحص يدوي</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>مُعَايِيرُ وُصُولٍ عَالِيَة (WCAG AAA)</span>
      <span>SLIDE 6 / 8</span>
    </div>
  </div>

  <!-- SLIDE 7: TYPOGRAPHY STACK -->
  <div class="slide">
    <div class="slide-header">
      <h2>مَنْظُومَةُ الْخُطُوطِ السِّتَّةِ الْمُعْتَمَدَة</h2>
      <span class="tag">06 · 6-TIER TYPOGRAPHY ARCHITECTURE</span>
    </div>
    <div class="slide-body">
      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 20px; width:100%;">
        <div class="card" style="padding:24px;">
          <h3>١. خَطُّ الشِّعَارِ السِّيَادِيّ</h3>
          <p><b>Diwan Thuluth:</b> خط الثلث الديواني العريق لعلامة مشكاة والمونوغرام.</p>
        </div>
        <div class="card" style="padding:24px;">
          <h3>٢. خَطُّ الْمُصْحَفِ الشَّرِيف</h3>
          <p><b>KFGQPC Uthmanic Script HAFS:</b> خط مجمع الملك فهد لطباعة المصحف الشريف.</p>
        </div>
        <div class="card" style="padding:24px;">
          <h3>٣. خَطُّ النُّصُوصِ التُّرَاثِيَّة</h3>
          <p><b>Amiri / Traditional Arabic:</b> للأحاديث، وكتب التفسير، وشروح المتون العلمية.</p>
        </div>
        <div class="card" style="padding:24px;">
          <h3>٤. خَطُّ وَاجِهَاتِ التَّطْبِيق</h3>
          <p><b>SF Arabic / Noto Sans Arabic:</b> للعناوين والأزرار والبحث والقوائم التفاعلية.</p>
        </div>
        <div class="card" style="padding:24px;">
          <h3>٥. خَطُّ اللَّاتِينِيَّةِ وَالأَرْقَام</h3>
          <p><b>SF Pro Rounded / Inter:</b> للأرقام، والتصنيفات، والترجمات الإنجليزية.</p>
        </div>
        <div class="card" style="padding:24px;">
          <h3>٦. خَطُّ الْبَرْمَجَةِ وَالْمُعَرِّفَات</h3>
          <p><b>JetBrains Mono / SF Mono:</b> لمعرفات URN وسجلات JSON البرمجية.</p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>تَسَلْسُلٌ طِبَاعِيٌّ مُنْضَبِط</span>
      <span>SLIDE 7 / 8</span>
    </div>
  </div>

  <!-- SLIDE 8: APP ICONS & MOTION -->
  <div class="slide">
    <div class="slide-header">
      <h2>أَيْقُونَةُ التَّطْبِيقِ وَالْحَرَكَةُ الرُّوحِيَّة</h2>
      <span class="tag">07 · MOBILE APP ICON SYSTEM &amp; MOTION CHOREOGRAPHY</span>
    </div>
    <div class="slide-body">
      <div class="grid-2col">
        <div class="card" style="align-items:center; text-align:center;">
          <div style="display:flex; gap:20px; align-items:center;">
            <div style="width:100px; height:100px; border-radius:22px; background:#09090B; border:1px solid #27272A; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 1024 1024" width="80" height="80">
                ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#goldGrad)")}
              </svg>
            </div>
            <div style="width:100px; height:100px; border-radius:22px; background:#F6F3EC; border:1px solid #DDD; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 1024 1024" width="80" height="80">
                ${renderMarkGroup(calligraphyRaw.primaryMark, "#705622")}
              </svg>
            </div>
            <div style="width:100px; height:100px; border-radius:50%; background:#09090B; border:1px dashed #C8A96A; display:flex; align-items:center; justify-content:center;">
              <svg viewBox="0 0 1024 1024" width="80" height="80">
                ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#goldGrad)")}
              </svg>
            </div>
          </div>
          <h3 style="margin-top:20px;">هَنْدَسَةُ أَيْقُونَةِ الْهَاتِف</h3>
          <p>
            تجريد الأيقونة من الحلقة الخارجية، واحتواء الخط داخل الدائرة الآمنة <b>66dp / 61%</b> لضمان عدم حدوث أي اقتطاع عبر شاشات iOS وAndroid.
          </p>
        </div>
        <div class="card">
          <h3>تَصْمِيمُ الْحَرَكَةِ (Motion Design)</h3>
          <p style="margin-bottom:12px;"><b>• حَرَكَةُ كَشْفِ الْخَطّ (Stroke Reveal):</b> رسم تدريجي سلس لخط الثلث مع تدرج تدفق النور الذهبي.</p>
          <p style="margin-bottom:12px;"><b>• إِضَاءَةُ التَّشْكِيلِ الْمُتَعَاقِبَة:</b> ظهور الحركات ونقاط الإعجام من اليمين إلى اليسار بترتيب القراءة.</p>
          <p style="margin-bottom:12px;"><b>• مُنْحَنَى الرِّقَّةِ السِّيَادِيّ:</b> cubic-bezier(0.22, 1, 0.36, 1) لتهدئة الحركة في سكون تام.</p>
          <p><b>• إِمْكَانِيَّةُ الْوُصُول:</b> دعم كامل لخاصية prefers-reduced-motion.</p>
        </div>
      </div>
    </div>
    <div class="slide-footer">
      <span>مِشْكَاة: نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون</span>
      <span>SLIDE 8 / 8</span>
    </div>
  </div>

</body>
</html>`;

  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
  });
  await page.setContent(brandBookHtml);
  await page.pdf({
    path: pdfPath,
    width: "1600px",
    height: "900px",
    printBackground: true,
  });
  console.log(`  ✓ Successfully generated 8-page Brand Book PDF: ${pdfPath}`);

  // Now render the Executive Sheet (2400x1500)
  console.log("📊 Rendering 2400×1500 Executive Brand Identity Sheet PNG...");
  const bentoPage = await browser.newPage({
    viewport: { width: 2400, height: 1500 },
    deviceScaleFactor: 1,
  });

  const bentoHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      width: 2400px;
      height: 1500px;
      background: #09090B;
      color: #F4F1EA;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 60px 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(200, 169, 106, 0.3);
      padding-bottom: 30px;
    }
    h1 { font-size: 38px; color: #C8A96A; font-weight: 500; }
    .header-sub { font-size: 18px; color: #71717A; letter-spacing: 4px; }
    .bento-grid {
      display: grid;
      grid-template-columns: 800px 1fr 600px;
      grid-template-rows: 620px 580px;
      gap: 36px;
      flex: 1;
      padding: 40px 0;
    }
    .bento-cell {
      background: #121215;
      border: 1.5px solid #27272A;
      border-radius: 24px;
      padding: 36px;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }
    .bento-cell.light {
      background: #EDEAE1;
      border-color: #E4E0D6;
      color: #18181B;
    }
    .cell-title {
      font-size: 20px;
      font-weight: 600;
      color: #C8A96A;
      margin-bottom: 16px;
    }
    .bento-cell.light .cell-title {
      color: #705622;
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1.5px solid rgba(200, 169, 106, 0.2);
      padding-top: 24px;
      font-size: 15px;
      color: #71717A;
      letter-spacing: 2px;
    }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>مِشْكَاة · لَوْحَةُ الْهُوِيَّةِ الْبَصَرِيَّةِ السِّيَادِيَّة</h1>
      <p style="font-size:16px; color:#A1A1AA; margin-top:6px;">نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون</p>
    </div>
    <div style="text-align:left;">
      <div class="header-sub">MISHKAAH EXECUTIVE BRAND IDENTITY BOARD</div>
      <div style="font-size:13px; color:#C8A96A; margin-top:6px;">ARCHITECTURAL INTEGRITY · WCAG AAA VERIFIED</div>
    </div>
  </header>

  <div class="bento-grid">
    <!-- Cell 1: Sovereign Primary Mark (Dark) -->
    <div class="bento-cell" style="align-items:center; justify-content:center; text-align:center;">
      <div class="cell-title" style="align-self:flex-start;">الشِّعَارُ السِّيَادِيُّ الدَّاكِن (Primary Mark Dark)</div>
      <svg viewBox="0 0 1024 1024" width="460" height="460">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2" stroke-opacity="0.30" />
        ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#bentoGold)")}
        <defs>
          <linearGradient id="bentoGold" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
            <stop offset="0%" stop-color="#E5CFA0" />
            <stop offset="100%" stop-color="#B89655" />
          </linearGradient>
          <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
            <stop offset="0%" stop-color="#8A6B2F" />
            <stop offset="100%" stop-color="#553F16" />
          </linearGradient>
        </defs>
      </svg>
      <div style="margin-top:16px; font-size:14px; color:#71717A;">Diwan Thuluth Calligraphy · Hairline Celestial Orbit (r=360) · Contrast 11.4:1</div>
    </div>

    <!-- Cell 2: Primary Mark Light & Monograms -->
    <div class="bento-cell light" style="align-items:center; justify-content:center; text-align:center;">
      <div class="cell-title" style="align-self:flex-start;">الشِّعَارُ الْفَاتِح (Warm Parchment Reading Surface)</div>
      <svg viewBox="0 0 1024 1024" width="440" height="440">
        <circle cx="512" cy="512" r="360" fill="none" stroke="#705622" stroke-width="2" stroke-opacity="0.35" />
        ${renderMarkGroup(calligraphyRaw.primaryMark, "#705622")}
      </svg>
      <div style="margin-top:16px; font-size:14px; color:#52525B;">Parchment Alabaster #F6F3EC · Umber Bronze Ink #705622 · Contrast 12.8:1</div>
    </div>

    <!-- Cell 3: Monogram Meem & App Icons -->
    <div class="bento-cell" style="justify-content:space-between;">
      <div>
        <div class="cell-title">مُونُوغْرَامُ الْمِيم (Monogram)</div>
        <div style="display:flex; justify-content:center; margin:16px 0;">
          <svg viewBox="0 0 1024 1024" width="220" height="220">
            <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2" stroke-opacity="0.30" />
            <path d="${monoD}" fill="url(#bentoGold)" fill-rule="nonzero" />
          </svg>
        </div>
      </div>
      <div>
        <div class="cell-title">حُزْمَةُ أَيْقُونَةِ التَّطْبِيق (App Icons)</div>
        <div style="display:flex; gap:16px; justify-content:center;">
          <div style="width:72px; height:72px; border-radius:16px; background:#09090B; border:1px solid #27272A; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 1024 1024" width="56" height="56">${renderMarkGroup(calligraphyRaw.primaryMark, "url(#bentoGold)")}</svg>
          </div>
          <div style="width:72px; height:72px; border-radius:16px; background:#F6F3EC; border:1px solid #E4E0D6; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 1024 1024" width="56" height="56">${renderMarkGroup(calligraphyRaw.primaryMark, "#705622")}</svg>
          </div>
          <div style="width:72px; height:72px; border-radius:50%; background:#09090B; border:1px dashed #C8A96A; display:flex; align-items:center; justify-content:center;">
            <svg viewBox="0 0 1024 1024" width="56" height="56">${renderMarkGroup(calligraphyRaw.primaryMark, "url(#bentoGold)")}</svg>
          </div>
        </div>
        <div style="text-align:center; margin-top:8px; font-size:11px; color:#71717A;">iOS 18 Dark · iOS 18 Light · Android 66dp Safe Zone</div>
      </div>
    </div>

    <!-- Cell 4: Horizontal Lockups (Span 2 Cols) -->
    <div class="bento-cell" style="grid-column: span 2; justify-content:center;">
      <div class="cell-title">التَّرْكِيبُ الأُفُقِيُّ الْمُوَحَّد (Horizontal Sovereign Lockups)</div>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:24px; align-items:center;">
        <div style="background:#09090B; border:1px solid #27272A; border-radius:16px; padding:24px;">
          <svg viewBox="0 0 1600 480" width="100%">
            <defs>
              <linearGradient id="bentoGold" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
                <stop offset="0%" stop-color="#E5CFA0" />
                <stop offset="100%" stop-color="#B89655" />
              </linearGradient>
              <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
                <stop offset="0%" stop-color="#8A6B2F" />
                <stop offset="100%" stop-color="#553F16" />
              </linearGradient>
            </defs>
            <g transform="translate(${280 - 512 * 0.52}, ${240 - 512 * 0.52}) scale(0.52)">
              <circle cx="512" cy="512" r="360" fill="none" stroke="#C8A96A" stroke-width="2.5" stroke-opacity="0.30" />
              ${renderMarkGroup(calligraphyRaw.primaryMark, "url(#bentoGold)")}
            </g>
            <line x1="560" y1="90" x2="560" y2="390" stroke="#C8A96A" stroke-width="1.5" stroke-opacity="0.35" />
            <g transform="translate(630, 110)">
              <g transform="translate(0, 0)"><path d="${latinD}" fill="#F4F1EA" /></g>
              <g transform="translate(0, 100)"><path d="${sloganArD}" fill="#C8A96A" /></g>
              <g transform="translate(0, 205)"><path d="${sloganEnD}" fill="#8C7A5B" /></g>
            </g>
          </svg>
        </div>
        <div style="background:#F6F3EC; border:1px solid #E4E0D6; border-radius:16px; padding:24px;">
          <svg viewBox="0 0 1600 480" width="100%">
            <g transform="translate(${280 - 512 * 0.52}, ${240 - 512 * 0.52}) scale(0.52)">
              <circle cx="512" cy="512" r="360" fill="none" stroke="#705622" stroke-width="2.5" stroke-opacity="0.35" />
              ${renderMarkGroup(calligraphyRaw.primaryMark, "#705622")}
            </g>
            <line x1="560" y1="90" x2="560" y2="390" stroke="#705622" stroke-width="1.5" stroke-opacity="0.35" />
            <g transform="translate(630, 110)">
              <g transform="translate(0, 0)"><path d="${latinD}" fill="#18181B" /></g>
              <g transform="translate(0, 100)"><path d="${sloganArD}" fill="#705622" /></g>
              <g transform="translate(0, 205)"><path d="${sloganEnD}" fill="#7A756B" /></g>
            </g>
          </svg>
        </div>
      </div>
    </div>

    <!-- Cell 5: Colors & Hadith Tokens -->
    <div class="bento-cell" style="justify-content:space-around;">
      <div class="cell-title">مَنْظُومَةُ الأَلْوَانِ وَشَارَاتُ التَّوْثِيق</div>
      <div style="display:flex; gap:12px;" dir="ltr">
        <div style="flex:1; height:60px; border-radius:12px; background:#09090B; border:1px solid #27272A; display:flex; align-items:center; justify-content:center; font-size:11px; color:#A1A1AA;" dir="ltr">#09090B</div>
        <div style="flex:1; height:60px; border-radius:12px; background:#F6F3EC; display:flex; align-items:center; justify-content:center; font-size:11px; color:#18181B;" dir="ltr">#F6F3EC</div>
        <div style="flex:1; height:60px; border-radius:12px; background:#C8A96A; display:flex; align-items:center; justify-content:center; font-size:11px; color:#09090B; font-weight:600;" dir="ltr">#C8A96A</div>
        <div style="flex:1; height:60px; border-radius:12px; background:#705622; display:flex; align-items:center; justify-content:center; font-size:11px; color:#FFF;" dir="ltr">#705622</div>
      </div>
      <div style="display:flex; gap:12px;">
        <div style="flex:1; padding:8px; border-radius:8px; background:rgba(16,185,129,0.15); border:1px solid #10B981; text-align:center; font-size:12px; color:#10B981;">صَحِيح</div>
        <div style="flex:1; padding:8px; border-radius:8px; background:rgba(59,130,246,0.15); border:1px solid #3B82F6; text-align:center; font-size:12px; color:#3B82F6;">حَسَن</div>
        <div style="flex:1; padding:8px; border-radius:8px; background:rgba(245,158,11,0.15); border:1px solid #F59E0B; text-align:center; font-size:12px; color:#F59E0B;">ضَعِيف</div>
        <div style="flex:1; padding:8px; border-radius:8px; background:rgba(239,68,68,0.15); border:1px solid #EF4444; text-align:center; font-size:12px; color:#EF4444;">تَنْبِيه</div>
      </div>
    </div>
  </div>

  <footer>
    <div>MISHKAAH · OPEN ISLAMIC CORPUS &amp; SACRED READER APPS</div>
    <div>100% OUTLINED VECTOR BEZIERS · 0 ANY / 0 UNKNOWN TYPESCRIPT ENGINE</div>
  </footer>
</body>
</html>`;

  await bentoPage.setContent(bentoHtml);
  await bentoPage.screenshot({ path: bentoSheetPng });
  await bentoPage.close();
  await page.close();

  console.log(`  ✓ Successfully generated Executive Bento Sheet PNG: ${bentoSheetPng}`);
}

// =============================================================================
// Part 3: Render 60fps Motion Videos via Playwright + FFmpeg
// =============================================================================

async function renderMotionVideos(browser: Browser, brandRoot: string): Promise<void> {
  console.log("🎬 Rendering 60fps Animation Videos (.mp4, .webm, & .webp)...");

  const videoDir = join(brandRoot, "animations", "video");
  const tempFramesDir = join(videoDir, "temp_frames");

  if (!existsSync(videoDir)) {
    mkdirSync(videoDir, { recursive: true });
  }

  // Delete stale / empty video files
  const existingFiles = readdirSync(videoDir);
  for (const f of existingFiles) {
    const fullPath = join(videoDir, f);
    if ((f.endsWith(".mp4") || f.endsWith(".webm") || f.endsWith(".webp")) && existsSync(fullPath)) {
      if (statSync(fullPath).size === 0) {
        rmSync(fullPath, { force: true });
      }
    }
  }

  interface RenderSeqOptions {
    name: string;
    width: number;
    height: number;
    totalFrames: number;
    fps: number;
    theme: "dark" | "light";
    aspectRatio: "16x9" | "9x16" | "1x1";
    markContours: Array<{ d: string }>;
    latinD: string;
    latinBounds: { width: number; height: number };
    sloganArD: string;
    sloganArBounds: { width: number; height: number };
    sloganEnD: string;
    sloganEnBounds: { width: number; height: number };
  }

  // Helper: Step an animation frame-by-frame and encode to MP4 / WebM / WebP
  async function renderAnimationSequence(options: RenderSeqOptions): Promise<void> {
    const {
      name,
      width,
      height,
      totalFrames,
      fps,
      theme,
      aspectRatio,
      markContours,
      latinD,
      latinBounds,
      sloganArD,
      sloganArBounds,
      sloganEnD,
      sloganEnBounds,
    } = options;
    console.log(`  Rendering ${name} (${width}×${height}, ${totalFrames} frames at ${fps}fps)...`);

    if (existsSync(tempFramesDir)) {
      rmSync(tempFramesDir, { recursive: true, force: true });
    }
    mkdirSync(tempFramesDir, { recursive: true });

    const isDark = theme === "dark";
    const bg = isDark ? "#09090B" : "#F6F3EC";
    const goldFill = isDark ? "url(#goldGrad)" : "url(#umberGrad)";
    const strokeCol = isDark ? "#E5CFA0" : "#8A6B2F";
    const titleFill = isDark ? "#F4F1EA" : "#18181B";
    const sloganArFill = isDark ? "#C8A96A" : "#705622";
    const sloganEnFill = isDark ? "#8C7A5B" : "#7A756B";

    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    let svgBody = "";

    if (aspectRatio === "16x9") {
      // 1920x1080 Widescreen Intro (left mark & orbit + divider + right wordmark and bilingual slogan)
      svgBody = `
  <svg id="stage" viewBox="0 0 1920 1080" width="1920" height="1080">
    <defs>
      <linearGradient id="goldGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#E5CFA0" />
        <stop offset="100%" stop-color="#B89655" />
      </linearGradient>
      <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#8A6B2F" />
        <stop offset="100%" stop-color="#553F16" />
      </linearGradient>
      <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.10" />
        <stop offset="65%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.03" />
        <stop offset="100%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Left Seal & Orbit -->
    <circle id="aura" cx="480" cy="540" r="400" fill="url(#auraGrad)" opacity="0" />
    <circle id="orbit" cx="480" cy="540" r="320" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="2011" stroke-dashoffset="2011" />
    <g id="mark" fill="${goldFill}" fill-opacity="0" stroke="${strokeCol}" stroke-width="1.2" stroke-dasharray="1600" stroke-dashoffset="1600" fill-rule="nonzero" transform="translate(121.6, 181.6) scale(0.70)">
${markContours.map((p) => `      <path d="${p.d}" />`).join("\n")}
    </g>
    <!-- Vertical Hairline Divider -->
    <line id="divider" x1="900" y1="240" x2="900" y2="840" stroke="${strokeCol}" stroke-width="1.5" stroke-opacity="0" />
    <!-- Right Typography Block -->
    <g transform="translate(990, 420)">
      <g id="title-g" opacity="0">
        <path d="${latinD}" fill="${titleFill}" />
      </g>
      <g id="slogan-ar-g" transform="translate(0, 100)" opacity="0">
        <path d="${sloganArD}" fill="${sloganArFill}" />
      </g>
      <g id="slogan-en-g" transform="translate(0, 195)" opacity="0">
        <path d="${sloganEnD}" fill="${sloganEnFill}" />
      </g>
    </g>
  </svg>`;
    } else if (aspectRatio === "9x16") {
      // 1080x1920 Vertical Mobile Splash (centered mark & orbit at 540, 800 + wordmark and Arabic slogan below at y=1220 and y=1310)
      const wmTX = 540 - latinBounds.width * 0.5;
      const arTX = 540 - sloganArBounds.width * 0.5;
      const enTX = 540 - sloganEnBounds.width * 0.5;

      svgBody = `
  <svg id="stage" viewBox="0 0 1080 1920" width="1080" height="1920">
    <defs>
      <linearGradient id="goldGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#E5CFA0" />
        <stop offset="100%" stop-color="#B89655" />
      </linearGradient>
      <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#8A6B2F" />
        <stop offset="100%" stop-color="#553F16" />
      </linearGradient>
      <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.10" />
        <stop offset="65%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.03" />
        <stop offset="100%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <!-- Centered Seal & Orbit -->
    <circle id="aura" cx="540" cy="800" r="380" fill="url(#auraGrad)" opacity="0" />
    <circle id="orbit" cx="540" cy="800" r="300" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="1885" stroke-dashoffset="1885" />
    <g id="mark" fill="${goldFill}" fill-opacity="0" stroke="${strokeCol}" stroke-width="1.2" stroke-dasharray="1600" stroke-dashoffset="1600" fill-rule="nonzero" transform="translate(181.6, 441.6) scale(0.70)">
${markContours.map((p) => `      <path d="${p.d}" />`).join("\n")}
    </g>
    <!-- Horizontal Hairline Divider -->
    <line id="divider" x1="440" y1="1150" x2="640" y2="1150" stroke="${strokeCol}" stroke-width="1.2" stroke-opacity="0" />
    <!-- Typography Stack Below -->
    <g id="title-g" transform="translate(${wmTX.toFixed(2)}, 1220)" opacity="0">
      <path d="${latinD}" fill="${titleFill}" />
    </g>
    <g id="slogan-ar-g" transform="translate(${arTX.toFixed(2)}, 1310)" opacity="0">
      <path d="${sloganArD}" fill="${sloganArFill}" />
    </g>
    <g id="slogan-en-g" transform="translate(${enTX.toFixed(2)}, 1400)" opacity="0">
      <path d="${sloganEnD}" fill="${sloganEnFill}" />
    </g>
  </svg>`;
    } else {
      // 1x1 Square (1080x1080)
      const isEmerge = name.includes("emerge");
      svgBody = `
  <svg id="stage" viewBox="0 0 1080 1080" width="1080" height="1080">
    <defs>
      <linearGradient id="goldGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#E5CFA0" />
        <stop offset="100%" stop-color="#B89655" />
      </linearGradient>
      <linearGradient id="umberGrad" gradientUnits="userSpaceOnUse" x1="260" y1="340" x2="760" y2="680">
        <stop offset="0%" stop-color="#8A6B2F" />
        <stop offset="100%" stop-color="#553F16" />
      </linearGradient>
      <radialGradient id="auraGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.10" />
        <stop offset="65%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0.03" />
        <stop offset="100%" stop-color="${isDark ? "#C8A96A" : "#705622"}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <g id="stage-group" transform="translate(0, 0)">
      <circle id="aura" cx="540" cy="540" r="420" fill="url(#auraGrad)" opacity="0" />
      <circle id="orbit" cx="540" cy="540" r="340" fill="none" stroke="${strokeCol}" stroke-width="2" stroke-dasharray="2136" stroke-dashoffset="${isEmerge ? "0" : "2136"}" stroke-opacity="${isEmerge ? "0.28" : "0"}" />
      <g id="mark" fill="${goldFill}" fill-opacity="${isEmerge ? "1" : "0"}" stroke="${strokeCol}" stroke-width="${isEmerge ? "0" : "1.2"}" stroke-dasharray="1600" stroke-dashoffset="${isEmerge ? "0" : "1600"}" fill-rule="nonzero" transform="translate(156, 156) scale(0.75)">
${markContours.map((p) => `        <path d="${p.d}" />`).join("\n")}
      </g>
    </g>
  </svg>`;
    }

    const html = `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${width}px;
      height: ${height}px;
      background: ${bg};
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg { display: block; }
  </style>
</head>
<body>
  ${svgBody}
  <script>
    function cubicBezier(t, p1x, p1y, p2x, p2y) {
      const u = 1 - t;
      return 3 * u * u * t * p1y + 3 * u * t * t * p2y + t * t * t;
    }

    window.setFrame = function(frameIndex, totalFrames) {
      const p = Math.max(0, Math.min(1, frameIndex / (totalFrames - 1)));
      const isEmerge = ${name.includes("emerge")};

      if (isEmerge) {
        const eased = cubicBezier(p, 0.16, 1, 0.3, 1);
        const scale = 0.94 + 0.06 * eased;
        const stageGroup = document.getElementById('stage-group');
        if (stageGroup) {
          stageGroup.setAttribute('transform', 'translate(' + (540 * (1 - scale)).toFixed(2) + ', ' + (540 * (1 - scale)).toFixed(2) + ') scale(' + scale.toFixed(4) + ')');
          stageGroup.setAttribute('opacity', eased.toFixed(3));
        }
        document.getElementById('orbit').setAttribute('stroke-opacity', (0.28 * eased).toFixed(2));
        document.getElementById('aura').setAttribute('opacity', eased.toFixed(3));
        return;
      }

      // Orbit: 0 to 45%
      const orbitP = Math.min(1, p / 0.45);
      const orbitEased = cubicBezier(orbitP, 0.22, 1, 0.36, 1);
      const circ = ${aspectRatio === "16x9" ? 2011 : aspectRatio === "9x16" ? 1885 : 2136};
      document.getElementById('orbit').setAttribute('stroke-dashoffset', (circ * (1 - orbitEased)).toFixed(2));
      document.getElementById('orbit').setAttribute('stroke-opacity', (0.28 * orbitEased).toFixed(2));

      // Mark: 15% to 75%
      const markP = Math.max(0, Math.min(1, (p - 0.15) / 0.60));
      const markEased = cubicBezier(markP, 0.22, 1, 0.36, 1);
      document.getElementById('mark').setAttribute('stroke-dashoffset', (1600 * (1 - markEased)).toFixed(2));
      const fillAlpha = markP > 0.4 ? Math.min(1, (markP - 0.4) / 0.5) : 0;
      document.getElementById('mark').setAttribute('fill-opacity', fillAlpha.toFixed(2));
      if (fillAlpha >= 1) {
        document.getElementById('mark').setAttribute('stroke-width', '0');
      } else {
        document.getElementById('mark').setAttribute('stroke-width', '1.2');
      }

      // Aura
      const auraP = Math.max(0, Math.min(1, (p - 0.20) / 0.60));
      document.getElementById('aura').setAttribute('opacity', cubicBezier(auraP, 0.16, 1, 0.3, 1).toFixed(3));

      // Divider: 35% to 70%
      const divEl = document.getElementById('divider');
      if (divEl) {
        const divP = Math.max(0, Math.min(1, (p - 0.35) / 0.35));
        const divEased = cubicBezier(divP, 0.16, 1, 0.3, 1);
        divEl.setAttribute('stroke-opacity', (0.35 * divEased).toFixed(3));
      }

      // Title: 45% to 80%
      const titleEl = document.getElementById('title-g');
      if (titleEl) {
        const titleP = Math.max(0, Math.min(1, (p - 0.45) / 0.35));
        const titleEased = cubicBezier(titleP, 0.16, 1, 0.3, 1);
        titleEl.setAttribute('opacity', titleEased.toFixed(3));
      }

      // Arabic Slogan: 55% to 88%
      const arEl = document.getElementById('slogan-ar-g');
      if (arEl) {
        const arP = Math.max(0, Math.min(1, (p - 0.55) / 0.33));
        const arEased = cubicBezier(arP, 0.16, 1, 0.3, 1);
        arEl.setAttribute('opacity', arEased.toFixed(3));
      }

      // English Slogan: 65% to 95%
      const enEl = document.getElementById('slogan-en-g');
      if (enEl) {
        const enP = Math.max(0, Math.min(1, (p - 0.65) / 0.30));
        const enEased = cubicBezier(enP, 0.16, 1, 0.3, 1);
        enEl.setAttribute('opacity', enEased.toFixed(3));
      }
    };
  </script>
</body>
</html>`;

    await page.setContent(html);

    // Capture each frame
    for (let f = 0; f < totalFrames; f++) {
      await page.evaluate(`window.setFrame(${f}, ${totalFrames})`);
      const frameFile = join(tempFramesDir, `frame_${String(f).padStart(4, "0")}.png`);
      await page.screenshot({ path: frameFile });
    }
    await page.close();

    // Encode MP4 via FFmpeg (H.264 yuv420p CRF 18)
    const mp4Path = join(videoDir, `${name}.mp4`);
    runCmd(
      `ffmpeg -y -f image2 -framerate ${fps} -i "${tempFramesDir}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 18 "${mp4Path}"`,
    );
    console.log(`    ✓ Encoded ${mp4Path}`);

    // If 16x9 or 1x1, also encode WebM
    if (options.aspectRatio === "16x9") {
      const webmPath = join(videoDir, `${name}.webm`);
      runCmd(
        `ffmpeg -y -f image2 -framerate ${fps} -i "${tempFramesDir}/frame_%04d.png" -c:v libvpx-vp9 -b:v 0 -crf 24 "${webmPath}"`,
      );
      console.log(`    ✓ Encoded ${webmPath}`);
    }

    // If 1x1, also generate animated WebP loop for README previews
    if (options.aspectRatio === "1x1") {
      const webpPath = join(videoDir, `${name}.webp`);
      // Use ImageMagick for high quality animated WebP
      runCmd(
        `magick -delay ${Math.round(100 / fps)} "${tempFramesDir}/frame_*.png" -loop 0 -resize 540x540 "${webpPath}"`,
      );
      console.log(`    ✓ Encoded animated loop ${webpPath}`);
    }

    rmSync(tempFramesDir, { recursive: true, force: true });
  }

  const calligraphyRaw = JSON.parse(
    readFileSync(join(brandRoot, "tokens", "calligraphy-paths.json"), "utf8"),
  );
  const markContours: Array<{ d: string }> = [
    ...calligraphyRaw.primaryMark.rasm,
    ...calligraphyRaw.primaryMark.tashkeel,
  ];
  const latinD = calligraphyRaw.latinWordmark.fullPath;
  const latinBounds = calligraphyRaw.latinWordmark.bounds;
  const sloganArD = calligraphyRaw.masterSloganAr.fullPath;
  const sloganArBounds = calligraphyRaw.masterSloganAr.bounds;
  const sloganEnD = calligraphyRaw.masterSloganEn.fullPath;
  const sloganEnBounds = calligraphyRaw.masterSloganEn.bounds;

  // 1. mishkaah-intro-16x9-dark
  await renderAnimationSequence({
    name: "mishkaah-intro-16x9-dark",
    width: 1920,
    height: 1080,
    totalFrames: 120, // 2.0s at 60fps
    fps: 60,
    theme: "dark",
    aspectRatio: "16x9",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // 2. mishkaah-intro-16x9-light
  await renderAnimationSequence({
    name: "mishkaah-intro-16x9-light",
    width: 1920,
    height: 1080,
    totalFrames: 120,
    fps: 60,
    theme: "light",
    aspectRatio: "16x9",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // 3. mishkaah-splash-9x16-dark
  await renderAnimationSequence({
    name: "mishkaah-splash-9x16-dark",
    width: 1080,
    height: 1920,
    totalFrames: 120,
    fps: 60,
    theme: "dark",
    aspectRatio: "9x16",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // 4. mishkaah-splash-9x16-light
  await renderAnimationSequence({
    name: "mishkaah-splash-9x16-light",
    width: 1080,
    height: 1920,
    totalFrames: 120,
    fps: 60,
    theme: "light",
    aspectRatio: "9x16",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // 5. mishkaah-reveal-1x1-dark
  await renderAnimationSequence({
    name: "mishkaah-reveal-1x1-dark",
    width: 1080,
    height: 1080,
    totalFrames: 120,
    fps: 60,
    theme: "dark",
    aspectRatio: "1x1",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // 6. mishkaah-emerge-1x1-dark
  await renderAnimationSequence({
    name: "mishkaah-emerge-1x1-dark",
    width: 1080,
    height: 1080,
    totalFrames: 120,
    fps: 60,
    theme: "dark",
    aspectRatio: "1x1",
    markContours,
    latinD,
    latinBounds,
    sloganArD,
    sloganArBounds,
    sloganEnD,
    sloganEnBounds,
  });

  // Copy rendered videos to alias files
  console.log("  Writing video aliases (real files, zero symlinks)...");
  const aliasCopies = [
    { src: "mishkaah-intro-16x9-dark.mp4", dest: "mishkaah-reveal-16x9.mp4" },
    { src: "mishkaah-intro-16x9-dark.webm", dest: "mishkaah-reveal-16x9.webm" },
    { src: "mishkaah-splash-9x16-dark.mp4", dest: "mishkaah-reveal-9x16.mp4" },
    { src: "mishkaah-reveal-1x1-dark.mp4", dest: "mishkaah-reveal-1x1.mp4" },
  ];
  for (const ac of aliasCopies) {
    const srcPath = join(videoDir, ac.src);
    const destPath = join(videoDir, ac.dest);
    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      console.log(`    ✓ Copied alias ${ac.dest}`);
    }
  }

  // Verification frame captures
  console.log("📸 Capturing Verification Frames and Screenshots...");
  runCmd(`ffmpeg -y -ss 00:00:01.800 -i "${join(videoDir, "mishkaah-intro-16x9-dark.mp4")}" -vframes 1 /tmp/verify-video-16x9.png`);
  runCmd(`ffmpeg -y -ss 00:00:01.800 -i "${join(videoDir, "mishkaah-splash-9x16-dark.mp4")}" -vframes 1 /tmp/verify-video-9x16.png`);

  const heroSvgPath = join(brandRoot, "animations", "svg", "mishkaah-hero-banner-animated.svg");
  const heroPage = await browser.newPage({ viewport: { width: 1600, height: 500 } });
  await heroPage.goto(`file://${heroSvgPath}`);
  await heroPage.waitForTimeout(2200);
  await heroPage.screenshot({ path: "/tmp/verify-hero-animated.png" });
  await heroPage.close();

  const revealSvgPath = join(brandRoot, "animations", "svg", "mishkaah-reveal-dark.svg");
  const revealPage = await browser.newPage({ viewport: { width: 1024, height: 1024 } });
  await revealPage.goto(`file://${revealSvgPath}`);
  await revealPage.waitForTimeout(2200);
  await revealPage.screenshot({ path: "/tmp/verify-reveal-animated.png" });
  await revealPage.close();
  console.log("  ✓ Verification screenshots captured in /tmp/verify-*.png");

  console.log("✨ Successfully rendered all motion videos and animated loops!");
}

// =============================================================================
// Master Orchestrator
// =============================================================================

async function main(): Promise<void> {
  const brandRoot = join(import.meta.dir, "..");
  console.log("🚀 Launching Headless Chromium via Playwright...");
  const browser = await chromium.launch({ headless: true });

  try {
    await renderStaticRasters(browser, brandRoot);
    await renderBrandBookAndSheet(browser, brandRoot);
    await renderMotionVideos(browser, brandRoot);
  } finally {
    await browser.close();
  }

  console.log("🎉 Complete Raster, Video, and Presentation Pipeline Finished!");
}

main().catch((err) => {
  console.error("Fatal rendering failure:", err);
  process.exit(1);
});
