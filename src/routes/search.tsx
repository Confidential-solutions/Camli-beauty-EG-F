import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useLocale } from "@/app/providers";
import { ProductCard } from "@/components/shared/ProductCard";
import { products } from "@/data/products";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q: string } => ({ q: typeof s["q"] === "string" ? s["q"].slice(0, 100) : "" }),
  head: () =>
    seoHead({
      path: '/search',
      title: 'Search — Camli Beauty Egypt',
      description: "Search Camli Beauty's heritage skincare products.",
      keywords: [],
      noindex: true,
    }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { t } = useLocale();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => [p.title.en, p.title.ar, p.tagline.en, p.tagline.ar].some((x) => x.toLowerCase().includes(s)));
  }, [q]);
  return (
    <div className="container-lux py-16">
      <h1 className="font-display text-5xl text-foreground">{t.pages.searchTitle}</h1>
      <input
        value={q}
        onChange={(e) => navigate({ search: { q: e.target.value }, replace: true })}
        placeholder={t.search.placeholder}
        aria-label={t.search.placeholder}
        className="mt-8 w-full max-w-xl rounded-full border border-border bg-background px-6 py-3 text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <p className="mt-4 text-sm text-muted-foreground">{t.pages.searchCount(results.length, q.trim())}</p>
      {results.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">{t.search.none}</p>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-3">
          {results.map((p) => <ProductCard key={p.handle} product={p} />)}
        </div>
      )}
    </div>
  );
}
