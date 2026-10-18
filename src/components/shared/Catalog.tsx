import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/app/providers";
import { isAvailable, lowestPrice, products, type Product } from "@/data/products";
import { formatPrice } from "@/lib/cart";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "low" | "high" | "az";
type Cat = "all" | Product["category"];
const MAX = Math.max(...products.map(lowestPrice));

export function Catalog({ bestOnly = false, initialCategory = "all" }: { bestOnly?: boolean; initialCategory?: Cat }) {
  const { t, l, locale } = useLocale();
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [cat, setCat] = useState<Cat>(initialCategory);
  useEffect(() => setCat(initialCategory), [initialCategory]);
  const [stock, setStock] = useState(false);
  const [max, setMax] = useState(MAX);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    let r = products.filter(
      (p) =>
        (!bestOnly || p.bestSeller) &&
        (cat === "all" || p.category === cat) &&
        (!stock || isAvailable(p)) &&
        lowestPrice(p) <= max &&
        (!s || [p.title.en, p.title.ar, p.tagline.en, p.tagline.ar].some((x) => x.toLowerCase().includes(s))),
    );
    if (sort === "low") r = [...r].sort((a, b) => lowestPrice(a) - lowestPrice(b));
    if (sort === "high") r = [...r].sort((a, b) => lowestPrice(b) - lowestPrice(a));
    if (sort === "az") r = [...r].sort((a, b) => l(a.title).localeCompare(l(b.title), locale));
    return r;
  }, [q, sort, cat, stock, max, bestOnly, l, locale]);

  const reset = () => {
    setQ("");
    setSort("featured");
    setCat("all");
    setStock(false);
    setMax(MAX);
  };
  const field = "rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary";
  const cats: Cat[] = ["all", "scrub", "butter", "eye"];

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-border py-5">
        <div className="flex flex-wrap gap-2">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className="btn-lux border border-border px-4 py-2 text-sm text-foreground transition aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground"
            >
              {c === "all" ? t.shop.all : t.home.categories[c]}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.shop.search} aria-label={t.shop.search} className={`${field} min-w-48 flex-1`} />
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t.shop.sort} className={field}>
            <option value="featured">{t.shop.sortFeatured}</option>
            <option value="low">{t.shop.sortLow}</option>
            <option value="high">{t.shop.sortHigh}</option>
            <option value="az">{t.shop.sortAz}</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-foreground">
            {t.shop.maxPrice}: {formatPrice(max, locale)}
            <input type="range" min={200} max={MAX} step={10} value={max} onChange={(e) => setMax(+e.target.value)} className="accent-primary" />
          </label>
          <label className="flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} className="accent-primary" />
            {t.shop.inStock}
          </label>
          <button onClick={reset} className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            {t.actions.clear}
          </button>
        </div>
      </div>
      <p className="my-6 text-sm text-muted-foreground">{t.shop.results(list.length)}</p>
      {list.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">{t.shop.empty}</p>
          <button onClick={reset} className="mt-4 btn-lux shadow-glow bg-primary px-6 py-3 text-primary-foreground">
            {t.actions.clear}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
