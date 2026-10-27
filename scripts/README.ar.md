<div align="center">

[English](./README.md) · **العربية**

# أدوات البناء والتحقق التلقائي لهوية مِشْكَاة

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![بيئة التشغيل](https://img.shields.io/badge/بيئة%20التشغيل-Bun%201.0%2B-09090B?style=flat-square)](https://bun.sh)
[![مخرجات البناء](https://img.shields.io/badge/المخرجات-CSS%20%7C%20TS%20%7C%20Dart-C8A96A?style=flat-square)](../tokens/README.ar.md)
[![حزمة التدقيق](https://img.shields.io/badge/حزمة%20التدقيق-فحص%20حتمي%20شامل-10B981?style=flat-square)](./verify-brand-integrity.ts)

</div>

---

## نظرة عامة

يضم مجلد **`scripts/`** حزم البناء البرمجية، وأدوات استخراج المسارات المتجهة عبر CoreText في لغة Swift، ومولدات ملفات الفيديو النقطية والمتجهة، وفحوصات السلامة الحتمية الخاصة بمستودع هوية مِشْكَاة. كُتبت كافة الأدوات لتعمل محلياً بدقة رياضية قابلة لإعادة الإنتاج التام عبر بيئة [Bun](https://bun.sh).

---

## فهرس الأدوات البرمجية

| مسار الأداة | المهمة والمسؤولية الأساسية | أمر التشغيل |
| :--- | :--- | :--- |
| [`extract-calligraphy-paths.swift`](./extract-calligraphy-paths.swift) | استخراج منحنيات بيزييه التكعيبية لحروف خط *ديوان الثلث* مباشرة من محرك CoreText في macOS، وحفظ المسارات في `tokens/calligraphy-paths.json`. | `swift scripts/extract-calligraphy-paths.swift` |
| [`generate-tokens-dist.ts`](./generate-tokens-dist.ts) | تجميع ملفات JSON المحايدة للمتغيرات التصميمية في حزم برمجية جاهزة للإنتاج (`tokens.css`, `tokens.ts`, `mishkaah_tokens.dart`). | `bun run scripts/generate-tokens-dist.ts` |
| [`generate-vectors-and-tokens.ts`](./generate-vectors-and-tokens.ts) | توليد كافة شعارات SVG المتجهة، والرسوم المتحركة، وحزم Lottie للهواتف، ومشغلات المعاينة التفاعلية. | `bun run scripts/generate-vectors-and-tokens.ts` |
| [`render-rasters-and-videos.ts`](./render-rasters-and-videos.ts) | تصيير الصور النقطية فائقة الدقة (PNG وWebP) عبر متصفح Chromium، وتجميع مقاطع الفيديو بمعدل 60 إطاراً في الثانية عبر FFmpeg، وتوليد كتيب الهوية بصيغة PDF. | `bun run scripts/render-rasters-and-videos.ts` |
| [`verify-brand-integrity.ts`](./verify-brand-integrity.ts) | أداة التدقيق الصارم لسلامة ملفات JSON، والتحقق من نقاء مسارات الرسوم المتجهة، ومطابقة التوثيق المزدوج، وصحة كافة الروابط والصور، وخلو النصوص من وسوم الرياضيات الممنوعة. | `bun run scripts/verify-brand-integrity.ts` |
| [`build-all.ts`](./build-all.ts) | إدارة وتشغيل سلسلة البناء والتوليد الحتمية الشاملة لكافة أصول الهوية بالتتابع. | `bun run rebuild-all` |

---

## بوابات التدقيق التلقائي (Integrity Gates)

عند تشغيل أداة [`verify-brand-integrity.ts`](./verify-brand-integrity.ts)، تُطبق خمس بوابات تدقيق صارمة:

1. **صحة ملفات الرموز والمتغيرات**: التأكد من سلامة صياغة ملفات JSON في مجلد `tokens/` وخلوها من الأخطاء النحوية أو الحقول الناقصة.
2. **نقاء الرسوم المتجهة واستقلال الخطوط**: التحقق من خلو ملفات SVG في `logos/` و`app-icons/` و`banners/` من أي وسوم نصية حية (`<text>`)، وضمان اعتمادها بالكامل على مسارات بيزييه التكعيبية المغلقة (`<path>`).
3. **تطابق التوثيق الثنائي المتزامن**: التحقق من احتواء كل مجلد فرعي في المستودع على دليل باللغة الإنجليزية `README.md` وقرين متطابق باللغة العربية الفصحى `README.ar.md`.
4. **حظر صيغ الرياضيات المعقدة في التوثيق**: فحص كافة ملفات `.md` للتأكد من عدم استخدام علامة الدولار (`$` أو `$$`) الخاصة بـ LaTeX خارج الكتل البرمجية.
5. **فحص الروابط والصور والأصول الرقمية**: استخراج كافة الروابط وصور Markdown وروابط GitHub المباشرة والتحقق من وجودها الفعلي على القرص واستيفائها لحدود الحجم الأدنى.

---

## الاستخدام والتشغيل المحلي

### المتطلبات الأساسية
- تثبيت بيئة [Bun](https://bun.sh) (الإصدار `1.0.0` أو أحدث).
- نظام macOS مع أدوات سطر الأوامر لـ Xcode (لتشغيل Swift).
- حزمة FFmpeg (لتجميع الفيديو بمعدل 60 إطاراً).

### إعادة بناء المنظومة بالكامل
لإعادة توليد كافة المتجهات والصور والفيديوهات وحزم المتغيرات بصورة حتمية:
```bash
bun run rebuild-all
```

### تشغيل حزمة التدقيق والتحقق
للتحقق من سلامة كافة أصول الهوية ومستنداتها محلياً:
```bash
bun run verify
# أو
bun run scripts/verify-brand-integrity.ts
```
