<div align="center">

[English](./README.md) · **العربية**

# أيقونات تطبيقات الهواتف الذكية لمِشْكَاة

### **نَصٌّ مَصُون.. وَعِلْمٌ مَأْمُون**
### **Preserved Text. Trusted Knowledge.**

[![جاهز لنظام iOS 18](https://img.shields.io/badge/iOS%2018%2B-داكن%20%7C%20فاتح%20%7C%20ملوّن-09090B?style=flat-square)](../docs/brand-guidelines.ar.md)
[![أيقونات أندرويد التكيفية](https://img.shields.io/badge/أندرويد-تكيفي%20%D9%88%D8%A3%D8%AD%D8%A7%D8%AF%D9%8A%20%D8%A7%D9%84%D9%84%D9%88%D9%86-10B981?style=flat-square)](../tokens/README.ar.md)
[![المنطقة الآمنة](https://img.shields.io/badge/المنطقة%20الآمنة-R%20%3D%20244.7px%20%28Android%2066dp%29-C8A96A?style=flat-square)](../docs/brand-guidelines.ar.md)

</div>

---

## نظرة عامة

يضم مجلد **`app-icons/`** أيقونات إطلاق التطبيقات والأيقونات المصغرة للمواقع (Favicons) الخاصة بتطبيق قارئ مِشْكَاة ومنصات الويب المرتبطة به. تلتزم كافة الأصول بدقة بإرشادات واجهات المستخدم لشركة آبل (Apple HIG) لأنظمة iOS 18+ ومعايير التصميم المادي لشركة جوجل (Material Design) للأيقونات التكيفية في نظام Android 13+.

<div align="center">

![لوحة استعراض أيقونات التطبيقات](./app-icon-showcase-grid.png)

</div>

---

## المعايير الهندسية والمنطقة الآمنة

تخضع أيقونات تشغيل التطبيقات لقيود هندسية تختلف عن علامات الوثائق والمطبوعات:

1. **استبعاد المدار الفلكي الخارجي عمداً**: في العلامات الخطية للوثائق، تمنح حلقة المدار الدقيقة (`r = 360`) إيحاءً بالاحتواء المعماري. أما في أيقونات إطلاق التطبيقات، فقد جرى استبعاد هذه الحلقة عمداً؛ وذلك لأن أنظمة تشغيل الهواتف تطبق أقنعة قص مختلفة (المربع فائق الاستدارة Squircle في iOS، والدوائر والمربعات والأشكال البيضاوية المتنوعة في Android). إن وجود حلقة دائرية رفيعة يؤدي حتماً إلى تداخل بصري غير منضبط مع حواف القناع وتشويه جمالية الأيقونة.
2. **نصف القطر البصري للشعار (`R = 244.7px`)**: ضُبط الشعار الخطي الأساسي الكامل **مِشْكَاة** ليتوسط مساحة العمل `1024×1024` بنصف قطر بصري يبلغ `R = 244.7px` ضمن المنطقة الآمنة `66dp` (بينما يُخصص مونوغرام حرف الميم `مـ` للأيقونات المصغرة جداً `<= 32px` وشارات التحميل الدقيقة).
3. **المنطقة الآمنة لنظام أندرويد التكيفي (`66dp / R = 312px`)**: تتطلب معايير أندرويد حصر المحتوى البصري الأساسي داخل دائرة مركزية بقطر `66dp` ضمن مساحة كلية تبلغ `108dp` (ما يعادل نصف قطر `R = 312px` على شبكة `1024×1024`). ويمنح نصف قطرنا البصري (`244.7px`) هامش أمان واسعاً يضمن عدم اقتطاع حروف الشعار أو ملامسة حوافها لأي قناع قص تعتمده الشركات المصنعة (Google Pixel, Samsung One UI, Xiaomi HyperOS, OnePlus OxygenOS).
4. **التوازن البصري لشبكة آبل (Apple HIG)**: توفر الأيقونة مساحة فراغ محيطة متناسقة تماماً مع شبكة شاشات هواتف آبل وشريط التطبيقات الرئيسي، مما يحافظ على هدوء الواجهة ووقارها.

---

## مصفوفة أنماط الأيقونات

| النمط | المنصة المستهدفة | أبعاد مساحة العمل | الملفات الرئيسية | الوصف والخصائص |
| :--- | :--- | :--- | :--- | :--- |
| **نمط iOS الداكن** | iOS 18+, iPadOS, macOS | 1024×1024 | [`app-icon-dark.png`](./app-icon-dark.png)، [`app-icon-dark.svg`](./app-icon-dark.svg) | خلفية داكنة سبجية `#09090B` مع الشعار الخطي الكامل المفرغ بذهب شامبين |
| **نمط iOS الفاتح** | iOS 18+, iPadOS, macOS | 1024×1024 | [`app-icon-light.png`](./app-icon-light.png)، [`app-icon-light.svg`](./app-icon-light.svg) | خلفية ورقية عاجية مرمرية `#F6F3EC` مع الشعار الخطي الكامل ببرونز كلاسيكي |
| **نمط iOS الملوّن** | واجهات iOS 18 المخصصة | 1024×1024 | [`app-icon-tinted.png`](./app-icon-tinted.png)، [`app-icon-tinted.svg`](./app-icon-tinted.svg) | قناع أحادي اللون يعتمد على كثافة الإضاءة ليتوافق تلقائياً مع خيارات الألوان التي يحددها المستخدم |
| **طبقة واجهة أندرويد (Foreground)** | Android 13+ التكيفي | 1024×1024 | [`android-adaptive-foreground.svg`](./android-adaptive-foreground.svg)، [`android-adaptive-foreground.png`](./android-adaptive-foreground.png) | طبقة متجهة شفافة تحتوي على الشعار الخطي الكامل بالذهب في المركز تماماً |
| **خلفية أندرويد (الداكنة)** | طبقة خلفية أندرويد | 1024×1024 | [`android-adaptive-background-dark.svg`](./android-adaptive-background-dark.svg) | طبقة لونية مصمتة باللون الأسود السبجي المطفي `#09090B` |
| **خلفية أندرويد (الفاتحة)** | طبقة خلفية أندرويد | 1024×1024 | [`android-adaptive-background-light.svg`](./android-adaptive-background-light.svg) | طبقة لونية مصمتة باللون العاجي المرمري الهادئ `#F6F3EC` |
| **أيقونات الويب المصغرة** | متصفحات الويب وتطبيقات PWA | قياسات متعددة | [`favicon.svg`](./favicon.svg)، [`apple-touch-icon.png`](./apple-touch-icon.png) | أيقونة متجهة عالية الوضوح لعلامات تبويب المتصفحات ومفضلة سفاري |

---

## إرشادات الدمج والتطبيق البرمجي

### تكوين نظام iOS (عبر حزم أصول Xcode)
في مشاريع أنظمة تشغيل آبل الحديثة:
- يُعين الملف `app-icon-dark.png` كخيار رئيسي للنمط الداكن داخل `AppIcon.appiconset`.
- يُعين الملف `app-icon-light.png` كخيار للنمط الفاتح.
- يُعين الملف `app-icon-tinted.png` للتعامل مع خيارات التلوين في iOS 18.

### تكوين نظام أندرويد (`res/mipmap-anydpi-v26/ic_launcher.xml`)
```xml
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/android_adaptive_background_dark" />
    <foreground android:drawable="@drawable/android_adaptive_foreground" />
    <monochrome android:drawable="@drawable/android_adaptive_foreground" />
</adaptive-icon>
```

### تكوين صفحات الويب (`index.html`)
```html
<link rel="icon" type="image/svg+xml" href="/brand/app-icons/favicon.svg" />
<link rel="apple-touch-icon" href="/brand/app-icons/apple-touch-icon.png" />
```
