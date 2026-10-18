/**
 * Catalog sourced from the live Camli Beauty Egypt Shopify store
 * (camlibeautyeg.com/products.json). Variant IDs are the real Shopify IDs so
 * checkout can hand off to the official store cart.
 */
export type Localized = { en: string; ar: string };

export interface Variant {
  id: number;
  title: Localized;
  price: number;
  compareAt?: number;
  available: boolean;
}

export interface Product {
  handle: string;
  title: Localized;
  tagline: Localized;
  category: "scrub" | "butter" | "eye";
  description: Localized;
  benefits: Localized[];
  details: { label: Localized; value: Localized }[];
  images: string[];
  variants: Variant[];
  bestSeller?: boolean;
}

const cdn = (f: string) => `https://cdn.shopify.com/s/files/1/0632/2749/4538/files/${f}`;

const L = (en: string, ar: string): Localized => ({ en, ar });

const SIZE = L("Size", "الحجم");
const SKIN = L("Skin type", "نوع البشرة");
const CONCERN = L("Skin concern", "مشكلة البشرة");
const SCENT = L("Scent", "الرائحة");
const FORM = L("Formulation", "القوام");
const ALL_SKIN = L("All skin types", "جميع أنواع البشرة");
const PASTE = L("Paste", "معجون");
const ML200 = L("200 mL", "٢٠٠ مل");

export const products: Product[] = [
  {
    handle: "nayra-hibiscus-dilka",
    title: L("Nayra Hibiscus Dilka", "دلكة نايرا بالكركديه"),
    tagline: L("Hibiscus body scrub", "مقشّر الجسم بالكركديه"),
    category: "scrub",
    description: L(
      "Our luxurious Nayra dilka powered by hibiscus as the star active ingredient. Hibiscus — nature's “Botox flower” — delivers gentle exfoliation and powerful antioxidants to fight free radicals, helps preserve elasticity and reduce fine lines, boosts collagen, locks in deep hydration, soothes irritation and promotes brighter skin.",
      "دلكة نايرا الفاخرة بالكركديه كمكوّن نشط رئيسي. الكركديه — «زهرة البوتوكس» الطبيعية — يمنح تقشيراً لطيفاً ومضادات أكسدة قوية لمحاربة الجذور الحرة، ويساعد على الحفاظ على مرونة البشرة وتقليل الخطوط الدقيقة، ويعزّز الكولاجين ويحبس الترطيب العميق ويهدّئ التهيّج ويمنح بشرة أكثر إشراقاً.",
    ),
    benefits: [
      L("Gentle exfoliation", "تقشير لطيف"),
      L("Rich in antioxidants", "غني بمضادات الأكسدة"),
      L("Supports elasticity & collagen", "يدعم المرونة والكولاجين"),
      L("Deep hydration, brighter skin", "ترطيب عميق وبشرة أكثر إشراقاً"),
    ],
    details: [
      { label: SIZE, value: ML200 },
      { label: SCENT, value: L("Dream Mist — peach, jasmine and musky amber over mossy, woody balsamic notes", "دريم ميست — خوخ وياسمين وعنبر مسكي مع لمسات خشبية بلسمية") },
      { label: CONCERN, value: L("Dull, dry, uneven texture", "بشرة باهتة وجافة وملمس غير متساوٍ") },
      { label: FORM, value: PASTE },
    ],
    images: [
      cdn("ChatGPTImageMay11_2026_02_43_47PM.png?v=1778503492"),
      cdn("ChatGPT_Image_May_12_2026_04_10_01_PM.png?v=1778595360"),
      cdn("ChatGPT_Image_May_5_2026_11_43_24_PM_048e1f42-e72b-4439-abe2-f09021de913f.png?v=1778507943"),
      cdn("IMG_2528.jpg?v=1779629403"),
    ],
    variants: [{ id: 47628847448202, title: L("Default", "افتراضي"), price: 550, available: true }],
  },
  {
    handle: "nayra-whipped-baked-body-butter-jar",
    title: L("Nayra Body Butter Jar", "زبدة الجسم نايرا — برطمان"),
    tagline: L("Whipped shea & baobab butter", "زبدة الشيا والباوباب المخفوقة"),
    category: "butter",
    bestSeller: true,
    description: L(
      "Immerse your skin in a moisturizing, radiant glow. Nayra Body Butter is a luxurious, whipped blend of shea butter, baobab oil and cocoa butter, designed to melt into the skin and restore softness, suppleness and lasting moisture.",
      "دلّلي بشرتك بترطيب وإشراقة. زبدة الجسم نايرا مزيج فاخر مخفوق من زبدة الشيا وزيت الباوباب وزبدة الكاكاو، يذوب في البشرة ليعيد إليها النعومة والليونة والترطيب الدائم.",
    ),
    benefits: [
      L("Shea, baobab & cocoa butter", "شيا وباوباب وزبدة كاكاو"),
      L("Lasting moisture", "ترطيب يدوم"),
      L("Soft, luminous finish", "لمسة ناعمة ومشرقة"),
    ],
    details: [
      { label: SIZE, value: ML200 },
      { label: SKIN, value: ALL_SKIN },
      { label: CONCERN, value: L("Dull, rough skin", "بشرة باهتة وخشنة") },
    ],
    images: [
      cdn("ChatGPT_Image_May_11_2026_04_25_55_PM.png?v=1778509571"),
      cdn("ChatGPT_Image_May_11_2026_04_19_27_PM.png?v=1778509263"),
      cdn("ChatGPT_Image_May_11_2026_04_21_29_PM.png?v=1778509304"),
      cdn("ChatGPT_Image_Apr_2_2025_at_02_21_58_AM.png?v=1764283187"),
      cdn("ChatGPT_Image_Apr_2_2025_at_02_12_14_AM.png?v=1764082148"),
      cdn("IMG_2529.jpg?v=1779629404"),
    ],
    variants: [
      { id: 47916790284426, title: L("Berry mix", "بيري ميكس"), price: 550, available: true },
      { id: 47389652484234, title: L("Sandalwood", "صندل"), price: 580, available: false },
      { id: 47389656285322, title: L("Whipped & baked", "ويبد آند بيكد"), price: 550, available: false },
      { id: 47916790317194, title: L("Dream mist", "دريم ميست"), price: 550, available: false },
    ],
  },
  {
    handle: "nayra-dilka-sandalwood-scent",
    title: L("Nayra Sandalwood Dilka", "دلكة نايرا بالصندل"),
    tagline: L("Bakhoor-scented body scrub", "مقشّر الجسم بعبق البخور"),
    category: "scrub",
    bestSeller: true,
    description: L(
      "A refreshing blend of natural ingredients for a gentle yet powerful exfoliating experience. Orange peel and corn starch, enriched with nourishing sweet almond oil and shea butter, delicately remove dead skin cells and impurities, revealing a radiant, healthy glow — with the warm, captivating scent of bakhoor.",
      "مزيج منعش من المكوّنات الطبيعية لتقشير لطيف وفعّال. قشر البرتقال ونشا الذرة مع زيت اللوز الحلو وزبدة الشيا المغذّية، يزيل الخلايا الميتة والشوائب بلطف ليكشف عن إشراقة صحية — مع عبق البخور الدافئ الآسر.",
    ),
    benefits: [
      L("Gentle, potent exfoliation", "تقشير لطيف وفعّال"),
      L("Sweet almond oil & shea butter", "زيت اللوز الحلو وزبدة الشيا"),
      L("Rich, lingering bakhoor scent", "عبق بخور غني يدوم"),
    ],
    details: [
      { label: SIZE, value: ML200 },
      { label: SKIN, value: ALL_SKIN },
      { label: CONCERN, value: L("Tired, dull and uneven texture", "بشرة متعبة وباهتة وملمس غير متساوٍ") },
      { label: SCENT, value: L("Creamy, woody sandalwood with smoky, incense-like notes from the dukhan process", "صندل كريمي خشبي مع لمسات دخانية من طقس الدخان") },
      { label: FORM, value: PASTE },
    ],
    images: [cdn("ChatGPT_Image_May_11_2026_02_52_37_PM.png?v=1778503982"), cdn("ChatGPT_Image_May_11_2026_04_13_50_PM.png?v=1778508850")],
    variants: [{ id: 44457339846794, title: L("Default", "افتراضي"), price: 570, available: true }],
  },
  {
    handle: "eye-boba",
    title: L("Eye Boba", "آي بوبا"),
    tagline: L("Hibiscus under-eye masks", "ماسكات تحت العين بالكركديه"),
    category: "eye",
    description: L(
      "Awaken your eyes with the power of hibiscus. Under-eye masks formulated with hibiscus extract — rich in antioxidants, vitamin C and natural AHAs — to visibly brighten, firm and rejuvenate tired eyes in just 15–20 minutes.",
      "أيقظي عينيكِ بقوة الكركديه. ماسكات تحت العين بخلاصة الكركديه الغنية بمضادات الأكسدة وفيتامين سي والأحماض الطبيعية، لتفتيح وشدّ وتجديد منطقة العين المتعبة في ١٥–٢٠ دقيقة فقط.",
    ),
    benefits: [
      L("Reduces the look of dark circles & puffiness", "يقلّل مظهر الهالات والانتفاخ"),
      L("Smooths fine lines", "ينعّم الخطوط الدقيقة"),
      L("Intense hydration", "ترطيب مكثّف"),
      L("Cruelty-free, all skin types", "خالٍ من القسوة، لجميع البشرات"),
    ],
    details: [
      { label: L("Key ingredient", "المكوّن الرئيسي"), value: L("Hibiscus extract", "خلاصة الكركديه") },
      { label: L("How to use", "طريقة الاستخدام"), value: L("Apply under the eyes and leave on for 15–20 minutes", "ضعيه تحت العينين واتركيه ١٥–٢٠ دقيقة") },
      { label: SKIN, value: ALL_SKIN },
    ],
    images: [cdn("ChatGPT_Image_May_11_2026_05_17_33_PM.png?v=1778512669"), cdn("ChatGPT_Image_May_11_2026_05_06_30_PM.png?v=1778512010")],
    variants: [
      { id: 50087972339850, title: L("Box of 12 pairs", "علبة ١٢ زوجاً"), price: 570, compareAt: 840, available: true },
      { id: 50088004354186, title: L("Box of 4 pairs", "علبة ٤ أزواج"), price: 280, available: false },
    ],
  },
  {
    handle: "nayra-offers",
    title: L("Nayra Body Butter Refill Bag", "زبدة الجسم نايرا — عبوة إعادة تعبئة"),
    tagline: L("Sustainable refill", "عبوة تعبئة مستدامة"),
    category: "butter",
    bestSeller: true,
    description: L(
      "A luxuriously whipped blend of shea butter, baobab oil and cocoa butter, created to melt into the skin and restore lasting moisture — in a refill bag for your Nayra jar. Leaves skin beautifully soft, supple and luminous.",
      "مزيج مخفوق فاخر من زبدة الشيا وزيت الباوباب وزبدة الكاكاو يذوب في البشرة ويعيد إليها الترطيب الدائم — في عبوة لإعادة تعبئة برطمان نايرا. يترك البشرة ناعمة ومرنة ومشرقة.",
    ),
    benefits: [L("Refill for your Nayra jar", "إعادة تعبئة لبرطمان نايرا"), L("Lasting moisture", "ترطيب يدوم"), L("Soft, luminous finish", "لمسة ناعمة ومشرقة")],
    details: [
      { label: SIZE, value: ML200 },
      { label: SKIN, value: ALL_SKIN },
      { label: CONCERN, value: L("Dull, rough skin", "بشرة باهتة وخشنة") },
    ],
    images: [
      cdn("ChatGPT_Image_May_11_2026_03_15_16_PM.png?v=1778505341"),
      cdn("ChatGPT_Image_May_11_2026_04_19_27_PM.png?v=1778509263"),
      cdn("ChatGPT_Image_May_11_2026_04_21_29_PM.png?v=1778509304"),
    ],
    variants: [
      { id: 47388420145290, title: L("Whipped & baked", "ويبد آند بيكد"), price: 480, available: true },
      { id: 47388614164618, title: L("Dream mist", "دريم ميست"), price: 490, available: true },
      { id: 47387713798282, title: L("Berry mix", "بيري ميكس"), price: 490, available: false },
    ],
  },
  {
    handle: "nayra-orange-dilka",
    title: L("Nayra Orange Dilka", "دلكة نايرا بالبرتقال"),
    tagline: L("Citrus & smoke body scrub", "مقشّر الجسم بالبرتقال والدخان"),
    category: "scrub",
    bestSeller: true,
    description: L(
      "A rejuvenating fusion of orange peel and corn starch, enriched with sweet almond oil and shea butter. Its lightweight paste texture delicately removes accumulated dead skin cells, revealing a radiant and healthy glow.",
      "مزيج منعش من قشر البرتقال ونشا الذرة مع زيت اللوز الحلو وزبدة الشيا. قوامه الخفيف يزيل الخلايا الميتة المتراكمة بلطف ليكشف عن إشراقة صحية.",
    ),
    benefits: [L("Orange peel exfoliation", "تقشير بقشر البرتقال"), L("Nourishing almond & shea", "لوز وشيا مغذّيان"), L("Radiant, healthy glow", "إشراقة صحية")],
    details: [
      { label: SIZE, value: ML200 },
      { label: SKIN, value: ALL_SKIN },
      { label: CONCERN, value: L("Tired, dull and uneven texture", "بشرة متعبة وباهتة وملمس غير متساوٍ") },
      { label: SCENT, value: L("Bright orange zest over a smoky, earthy base", "قشر برتقال منعش فوق قاعدة دخانية ترابية") },
      { label: FORM, value: PASTE },
    ],
    images: [cdn("ChatGPT_Image_May_11_2026_02_56_10_PM.png?v=1778504187"), cdn("ChatGPT_Image_May_11_2026_04_13_50_PM.png?v=1778508850")],
    variants: [{ id: 44496825057418, title: L("Default", "افتراضي"), price: 490, available: true }],
  },
];

export const STORE_URL = "https://www.camlibeautyeg.com";
export const SOCIALS = {
  instagram: "https://www.instagram.com/camlibeauty/",
  facebook: "https://www.facebook.com/camlibeauty/",
  tiktok: "https://www.tiktok.com/@camlibeauty",
};

export const getProduct = (handle: string) => products.find((p) => p.handle === handle);
export const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.price));
export const isAvailable = (p: Product) => p.variants.some((v) => v.available);
export const defaultVariant = (p: Product): Variant => (p.variants.find((v) => v.available) ?? p.variants[0])!;
export const findVariant = (id: number) => {
  for (const p of products) {
    const v = p.variants.find((x) => x.id === id);
    if (v) return { product: p, variant: v };
  }
  return undefined;
};
