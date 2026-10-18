import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { Catalog } from "@/components/shared/Catalog";

export const Route = createFileRoute("/best-sellers")({
  head: () =>
    seoHead({
      path: '/best-sellers',
      title: 'Best Sellers — Dilka & Body Butter | Camli Beauty Egypt',
      description: "Shop Camli's most-loved rituals: Nayra whipped body butter, sandalwood dilka and orange dilka. Natural Sudanese body care delivered across Egypt.",
      keywords: ['best sellers', 'Nayra body butter', 'sandalwood dilka', 'orange dilka'],
    }),
  component: Best,
});

function Best() {
  const { t } = useLocale();
  return (
    <section className="container-lux py-16">
      <h1 className="font-display text-5xl text-foreground">{t.shop.bestTitle}</h1>
      <p className="mb-10 mt-3 text-muted-foreground">{t.home.bestTitle}</p>
      <Catalog bestOnly />
    </section>
  );
}
