import { brandMedia } from "@/data/brand";
import { seoHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { HeroVideo } from "@/components/shared/HeroVideo";
import { useLocale } from "@/app/providers";
import { getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/shared/ProductCard";
import { Reveal } from "@/components/shared/Reveal";
import { Newsletter } from "@/components/layout/Footer";
import { MissionGalleryMain, MissionGalleryThumbs, useGallery } from "@/components/shared/MissionGallery";

const HERO = getProduct("nayra-hibiscus-dilka")!.images[0];
const MISSION_IMAGES = [brandMedia.campaign, ...brandMedia.reels];

export const Route = createFileRoute("/")({
  head: () => {
    const h = seoHead({
      path: "/",
      title: "Camli Beauty Egypt — Sudanese Dilka, Body Butter & Natural Skincare",
      description:
        "Shop Camli Beauty in Egypt: hibiscus, sandalwood & orange dilka body scrubs, whipped body butter and Eye Boba under-eye masks rooted in Sudanese beauty rituals.",
      keywords: ["hibiscus dilka", "دلكة كركديه", "Nayra dilka", "Eye Boba", "ماسك تحت العين", "Sudanese skincare"],
      image: HERO,
    });
    return {
      ...h,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Camli Beauty products",
            itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `/products/${p.handle}`, name: p.title.en })),
          }),
        },
      ],
    };
  },
  component: Home,
});

const RITUALS = {
  scrub: { step: { en: "Ritual I · Exfoliate", ar: "الطقس ١ · تقشير" }, line: { en: "Ancestral hibiscus, sandalwood & dukhan pastes.", ar: "معاجين الكركديه والصندل والدخان المتوارثة." } },
  butter: { step: { en: "Ritual II · Nourish", ar: "الطقس ٢ · تغذية" }, line: { en: "Whipped shea, baobab & cocoa for lasting softness.", ar: "شيا وباوباب وكاكاو مخفوقة لنعومة تدوم." } },
  eye: { step: { en: "Ritual III · Awaken", ar: "الطقس ٣ · إيقاظ" }, line: { en: "Hibiscus eye masks that brighten in 15 minutes.", ar: "ماسكات الكركديه لإشراقة العين في ١٥ دقيقة." } },
} as const;

function Home() {
  const { t, l, locale } = useLocale();
  const best = products.filter((p) => p.bestSeller);
  const spotlight = getProduct("nayra-dilka-sandalwood-scent")!;
  const cats = (["scrub", "butter", "eye"] as const).map((c) => ({ c, p: products.find((p) => p.category === c)! }));
  const mission = useGallery(MISSION_IMAGES);

  return (
    <>
      {/* Hero — full-bleed brand film, as on camlibeautyeg.com */}
      <HeroVideo
        eyebrow={t.hero.eyebrow}
        title1={t.hero.title1}
        title2={t.hero.title2}
        body={t.hero.body}
        shopThis={t.actions.shopThis}
        shopAll={t.actions.shopAll}
      />

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border py-4" aria-hidden>
        <div className="marquee flex w-max gap-12 whitespace-nowrap font-display text-2xl italic text-primary">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i}>{i % 2 ? t.home.marquee : "Camli Beauty ✦"}</span>
          ))}
        </div>
      </div>

      {/* Intro */}
      <section className="container-lux grid gap-12 py-24 md:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t.home.introEyebrow}</p>
          <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{t.home.introTitle}</h2>
        </Reveal>
        <Reveal delay={0.1} className="space-y-8 text-muted-foreground">
          <p>{t.home.introBody}</p>
          <div className="border-s-2 border-primary ps-6">
            <h3 className="font-display text-2xl text-foreground">{t.home.formulaTitle}</h3>
            <p className="mt-2">{t.home.formulaBody}</p>
          </div>
        </Reveal>
      </section>

      {/* Best sellers */}
      <section className="container-lux py-12">
        <Reveal className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">{t.home.bestEyebrow}</p>
            <h2 className="mt-3 font-display text-4xl text-foreground">{t.home.bestTitle}</h2>
          </div>
          <Link to="/best-sellers" className="text-sm text-primary hover:underline">{t.actions.shopAll}</Link>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-3">
          {best.map((p) => <ProductCard key={p.handle} product={p} />)}
        </div>
      </section>

      {/* Collections */}
      <section className="container-lux py-24">
        <Reveal>
          <p className="eyebrow">{t.home.collectionEyebrow}</p>
          <h2 className="mt-3 font-display text-4xl text-foreground">{t.home.collectionTitle}</h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cats.map(({ c, p }, i) => {
            const r = RITUALS[c];
            const count = products.filter((x) => x.category === c).length;
            return (
              <Reveal key={c} delay={i * 0.08}>
                <Link
                  to="/shop"
                  search={{ category: c }}
                  className="group card-lux flex h-full flex-col overflow-hidden rounded-3xl p-2"
                >
                  <div className="product-stage aspect-[4/5] overflow-hidden rounded-[1.25rem]">
                    <span aria-hidden className="product-floor absolute inset-x-[18%] bottom-[7%] h-[8%] rounded-full" />
                    <img
                      src={p.images[0]}
                      alt=""
                      loading="lazy"
                      className="product-cutout absolute inset-0 h-full w-full p-8 transition duration-700 ease-lux group-hover:-translate-y-2 group-hover:scale-[1.05]"
                    />
                    <span className="absolute start-4 top-4 rounded-full bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
                      {l(r.step)}
                    </span>
                    <span className="absolute end-4 top-4 font-display text-2xl text-foreground/60">0{i + 1}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-5">
                    <h3 className="font-display text-3xl leading-tight text-card-foreground">{t.home.categories[c]}</h3>
                    <p className="text-sm text-muted-foreground">{l(r.line)}</p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                      <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {locale === "ar" ? `${count} ${count === 1 ? "منتج" : "منتجات"}` : `${count} ${count === 1 ? "formula" : "formulas"}`}
                      </span>
                      <span className="rounded-full border border-border px-4 py-2 text-xs uppercase tracking-wider text-primary transition group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-glow">
                        {locale === "ar" ? "اكتشفي ←" : "Explore →"}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Spotlight */}
      <section className="bg-secondary/50 py-24">
        <div className="container-lux grid items-center gap-12 md:grid-cols-2">
          <Reveal className="order-2 md:order-1">
            <Link
              to="/products/$handle"
              params={{ handle: spotlight.handle }}
              className="group card-lux block rounded-[2.25rem] p-2"
              aria-label={l(spotlight.title)}
            >
              <div className="product-stage aspect-square overflow-hidden rounded-[1.75rem]">
                <span aria-hidden className="product-floor absolute inset-x-[22%] bottom-[8%] h-[7%] rounded-full" />
                <img
                  src={spotlight.images[0]}
                  alt={l(spotlight.title)}
                  loading="lazy"
                  className="product-cutout absolute inset-0 h-full w-full p-10 transition duration-700 ease-lux group-hover:-translate-y-2 group-hover:scale-[1.04]"
                />
                <span className="absolute start-5 top-5 rounded-full bg-background/80 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
                  {l(spotlight.tagline)}
                </span>
              </div>
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="order-1 md:order-2">
            <p className="eyebrow">{t.home.spotlightEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-foreground md:text-5xl">{t.home.spotlightTitle}</h2>
            <p className="mt-6 text-muted-foreground">{t.home.spotlightBody}</p>
            <Link to="/products/$handle" params={{ handle: spotlight.handle }} className="mt-8 inline-block btn-lux shadow-glow bg-primary px-8 py-3.5 text-primary-foreground">
              {t.actions.shopThis}
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Mission */}
      {/* Film + reels */}
      <section className="relative overflow-hidden py-24">
        <img src={brandMedia.texture} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-10" />
        <div className="container-lux relative grid items-center gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">{t.home.missionEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl text-foreground md:text-6xl">{t.home.missionTitle}</h2>
            <p className="mt-6 text-muted-foreground">{t.home.missionBody}</p>
            <MissionGalleryThumbs images={MISSION_IMAGES} label={t.product.gallery} {...mission} />
          </Reveal>
          <Reveal delay={0.1}>
            <MissionGalleryMain images={MISSION_IMAGES} label={t.product.gallery} {...mission} />
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="relative overflow-hidden px-5 py-12 md:py-20">
        <div className="relative mx-auto max-w-4xl">
          <Reveal className="club-card p-8 text-center sm:p-12 md:p-20">
            <span aria-hidden className="club-corner left-6 top-6 rounded-tl-2xl border-l border-t" />
            <span aria-hidden className="club-corner right-6 top-6 rounded-tr-2xl border-r border-t" />
            <span aria-hidden className="club-corner bottom-6 left-6 rounded-bl-2xl border-b border-l" />
            <span aria-hidden className="club-corner bottom-6 right-6 rounded-br-2xl border-b border-r" />
            <span className="mb-6 block text-[10px] font-bold uppercase tracking-[0.5em] text-primary">{t.newsletter.eyebrow}</span>
            <h2 className="mb-5 font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[0.95] tracking-tight text-foreground">
              {t.newsletter.titleLead}
              <br />
              <span className="club-gradient-text">{t.newsletter.titleEm}</span>
            </h2>
            <p className="mx-auto mb-10 max-w-md text-sm leading-relaxed text-muted-foreground">{t.newsletter.body}</p>
            <Newsletter variant="club" />
            <p className="mt-4 text-[10px] uppercase tracking-widest text-muted-foreground/60">{t.newsletter.noSpam}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
