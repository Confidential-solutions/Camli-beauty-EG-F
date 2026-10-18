/** Shared head-metadata builder so every page ships the same complete SEO tag set. */
export const SITE_NAME = "Camli Beauty Egypt";

export const CORE_KEYWORDS = [
  "Camli Beauty",
  "كاملي بيوتي",
  "dilka",
  "دلكة",
  "Sudanese dilka",
  "دلكة سودانية",
  "body scrub Egypt",
  "مقشر الجسم",
  "body butter Egypt",
  "زبدة الجسم",
  "natural skincare Egypt",
];

interface SeoInput {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  type?: string;
  image?: string | undefined;
  noindex?: boolean;
}

export function seoHead({ title, description, path, keywords = [], type = "website", image, noindex }: SeoInput) {
  const meta: Record<string, string>[] = [
    { title },
    { name: "description", content: description },
    { name: "keywords", content: [...keywords, ...CORE_KEYWORDS].join(", ") },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:card", content: "summary_large_image" },
  ];
  if (image) meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  if (noindex) meta.push({ name: "robots", content: "noindex, follow" });
  return { meta, links: noindex ? [] : [{ rel: "canonical", href: path }] };
}
