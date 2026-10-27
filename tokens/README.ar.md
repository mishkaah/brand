<div align="center">

[English](./README.md) · **العربية**

# متغيرات التصميم والرموز القياسية لمِشْكَاة

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![معيار الرموز](https://img.shields.io/badge/الرموز-مسودة%20W3C%20القياسية-C8A96A?style=flat-square)](../docs/color-and-theme-system.ar.md)
[![المنصات المدعومة](https://img.shields.io/badge/المنصات-CSS%20%7C%20TypeScript%20%7C%20Dart-09090B?style=flat-square)](./dist/tokens.ts)
[![التباين البصري](https://img.shields.io/badge/التباين-WCAG%20AAA%20(11.4%3A1%20%2F%2012.8%3A1)-10B981?style=flat-square)](../docs/color-and-theme-system.ar.md)

</div>

---

## نظرة عامة

يمثل مجلد **`tokens/`** المصدر المرجعي الموحد لكافة المتغيرات البصرية لمنظومة مِشْكَاة. تُعرف هذه الرموز (Design Tokens) القرارات التصميمية الجوهرية — كالرموز الست عشرية للألوان، وحزم الخطوط الطباعية، ومنحنيات الحركة الفيزيائية، والشعارات المعتمدة — بصيغة JSON محايدة ومستقلة عن المنصات، ثم تُترجم تلقائياً إلى حزم برمجية منضبطة الأنواع لمنصات الويب (CSS)، وتطبيقات TypeScript، والهواتف الذكية (Dart / Flutter).

---

## الهيكل التراتبي لملفات المتغيرات

```
tokens/
├── colors.json           # ألوان المنظومة، التدرجات، ألوان أسطح القراءة، وشارات درجات الحديث
├── typography.json       # حزم الخطوط، قواعد الاستبدال التلقائي، وميزات OpenType
├── slogans.json          # الشعار الأساسي للمنظومة وشعارات أركانها الأربعة باللغتين
├── motion.json           # منحنيات بيزييه التكعيبية للحركة، ومراحل المشاهد، وقواعد الوصول
└── dist/
    ├── tokens.css        # متغيرات CSS القياسية (Custom Properties)
    ├── tokens.ts         # كائنات وثوابت TypeScript منضبطة الأنواع
    └── mishkaah_tokens.dart # تعريفات ألوان Flutter ومنحنيات الحركة المكعبة
```

---

## ملخص منظومة الألوان

| رمز المتغير | الدور البصري والوظيفي | القيمة اللونية | نسبة التباين البصري |
| :--- | :--- | :--- | :--- |
| `obsidian` | خلفية النمط الداكن وشاشات OLED المطفاة | `#09090B` | المرجع الأساسي |
| `alabaster` | خلفية النمط الفاتح وسطح القراءة الورقي العاجي | `#F6F3EC` | المرجع الأساسي |
| `champagneGold` | الشعار الخطي الأساسي، وأبرز عناصر التركيز | `#C8A96A` (`#E5CFA0` ← `#B89655`) | **11.4:1** على الخلفية الداكنة (معيار AAA) |
| `umberBronze` | الشعار الخطي الفاتح، وتباين الحبر الكلاسيكي | `#705622` (`#8A6B2F` ← `#553F16`) | **12.8:1** على الخلفية الفاتحة (معيار AAA) |
| `sahih` | شارة الحديث الصحيح المعتمد | `#10B981` | 4.8:1 على الأسطح الداكنة |
| `hasan` | شارة الحديث الحسن | `#3B82F6` | 4.6:1 على الأسطح الداكنة |
| `daif` | شارة الحديث الضعيف | `#F59E0B` | 5.2:1 على الأسطح الداكنة |
| `alert` | شارات التحذير في المراجعة النصية والتقابل | `#EF4444` | 4.9:1 على الأسطح الداكنة |

---

## ملخص حزم الخطوط الطباعية

| معرف الحزمة | التدرج التنازلي لعائلات الخطوط | بيئة الاستخدام المستهدفة |
| :--- | :--- | :--- |
| `brandmark` | `"Diwan Thuluth", "Mishafi", "Amiri", serif` | الشعارات والعلامات الخطية الرسمية |
| `quranScripture` | `"KFGQPC Uthmanic Script HAFS", "Amiri Quran", serif` | الآيات القرآنية الكريمة بالرسم العثماني وضبط المصحف الشريف |
| `classicalProse` | `"Amiri", "Amiri Quran", "Traditional Arabic", serif` | متون الحديث الشريف، كتب التفسير، التراجم وشروح المخطوطات |
| `modernArabicUI` | `"SF Arabic", "Noto Sans Arabic", system-ui, sans-serif` | قوائم التطبيقات، أزرار التحكم، حقول البحث والإعدادات |
| `latinAndNumerals` | `"Inter", -apple-system, BlinkMacSystemFont, sans-serif` | أرقام الآيات، عناوين معرفات URN، والبيانات الوصفية |
| `monospaceCode` | `"JetBrains Mono", "SF Mono", Menlo, monospace` | سجلات المدقق، عارض سجلات JSON، وبيانات سطر الأوامر |

---

## الاستخدام والدمج البرمجي

### تطوير الويب عبر CSS (`dist/tokens.css`)
```css
@import "@mishkaah/brand/tokens/dist/tokens.css";

.reading-surface {
  background-color: var(--mishkaah-color-obsidian);
  color: var(--mishkaah-text-high-dark);
  font-family: var(--mishkaah-font-classical);
}
```

### مشاريع TypeScript / React (`dist/tokens.ts`)
```typescript
import { MISHKAAH_COLORS, MISHKAAH_SLOGANS } from "./dist/tokens.ts";

console.log(MISHKAAH_SLOGANS.master.ar);
// "نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون"
```

### تطبيقات الهواتف الذكية في Flutter (`dist/mishkaah_tokens.dart`)
```dart
import 'package:mishkaah_brand/tokens/dist/mishkaah_tokens.dart';

Container(
  color: MishkaahColors.obsidian,
  child: Text(
    "مِشْكَاة",
    style: TextStyle(color: MishkaahColors.champagneGold),
  ),
);
```
