import { seoHead } from "@/lib/seo";
import { brandMedia } from "@/data/brand";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { getProduct } from "@/data/products";
import { Reveal } from "@/components/shared/Reveal";

export const Route = createFileRoute("/about")({
  head: () =>
    seoHead({
      path: '/about',
      title: 'About Camli Beauty — Sudanese Dilka & Natural Skincare Heritage',
      description: 'Camli Beauty reimagines Sudanese and African beauty rituals — dilka, body butter and hibiscus care — with natural ingredients sourced from women artisans.',
      keywords: ['about Camli', 'Sudanese beauty rituals', 'African skincare', 'women artisans'],
    }),
  component: About,
});

function About() {
  const { t } = useLocale();
  const img = brandMedia.campaign;
  return (
    <div className="container-lux py-16">
      <Reveal className="max-w-3xl">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h1 className="mt-4 font-display text-4xl leading-tight text-foreground md:text-6xl">{t.about.title}</h1>
      </Reveal>
      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <Reveal>
          <img src={img} alt="" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-soft" />
        </Reveal>
        <Reveal delay={0.1} className="space-y-6 leading-relaxed text-muted-foreground">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <ul className="grid grid-cols-2 gap-3 pt-4">
            {t.about.values.map((v) => (
              <li key={v} className="rounded-2xl border border-border p-4 font-display text-lg text-foreground">{v}</li>
            ))}
          </ul>
          <Link to="/shop" className="inline-block btn-lux shadow-glow bg-primary px-8 py-3.5 text-primary-foreground">{t.actions.shopAll}</Link>
        </Reveal>
      </div>
    </div>
  );
}
