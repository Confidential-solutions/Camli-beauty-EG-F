import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { Catalog } from "@/components/shared/Catalog";

export const Route = createFileRoute("/shop")({
  head: () =>
    seoHead({
      path: "/shop",
      title: "Shop Dilka, Body Butter & Eye Masks | Camli Beauty Egypt",
      description:
        "Shop all Camli rituals: hibiscus, sandalwood and orange dilka scrubs, whipped body butter and Eye Boba hibiscus under-eye masks. Natural skincare in Egypt.",
      keywords: ["shop dilka", "hibiscus dilka", "eye mask", "under-eye patches"],
    }),
  validateSearch: (s: Record<string, unknown>): { category?: "scrub" | "butter" | "eye" } =>
    s["category"] === "scrub" || s["category"] === "butter" || s["category"] === "eye"
      ? { category: s["category"] }
      : {},
  component: Shop,
});

function Shop() {
  const { t } = useLocale();
  const { category } = Route.useSearch();
  return (
    <section className="container-lux py-16">
      <h1 className="font-display text-5xl text-foreground">{t.shop.title}</h1>
      <p className="mb-10 mt-3 text-muted-foreground">{t.shop.subtitle}</p>
      <Catalog initialCategory={category ?? "all"} />
    </section>
  );
}
