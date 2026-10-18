import { Link } from "@tanstack/react-router";
import { useCart, useLocale } from "@/app/providers";
import { defaultVariant, isAvailable, lowestPrice, type Product } from "@/data/products";
import { formatPrice } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const { t, l, locale } = useLocale();
  const { add } = useCart();
  const available = isAvailable(product);
  const v = defaultVariant(product);
  const multi = product.variants.length > 1;
  return (
    <article className="group card-lux flex flex-col overflow-hidden rounded-3xl p-2">
      <Link
        to="/products/$handle"
        params={{ handle: product.handle }}
        className="product-stage block aspect-[4/5] overflow-hidden rounded-[1.25rem]"
        aria-label={l(product.title)}
      >
        <span aria-hidden className="product-floor absolute inset-x-[18%] bottom-[7%] h-[8%] rounded-full" />
        <img
          src={product.images[0]}
          alt={l(product.title)}
          loading="lazy"
          className="product-cutout absolute inset-0 h-full w-full p-6 transition duration-700 ease-lux group-hover:-translate-y-2 group-hover:scale-[1.04]"
        />
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt=""
            loading="lazy"
            className="product-cutout absolute inset-0 h-full w-full p-6 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {!available ? (
            <span className="rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-foreground backdrop-blur">
              {t.actions.soldOut}
            </span>
          ) : product.bestSeller ? (
            <span className="rounded-full bg-background/80 px-3 py-1 text-[11px] uppercase tracking-wider text-foreground backdrop-blur">
              ★
            </span>
          ) : <span />}
          {v.compareAt && (
            <span className="btn-lux shadow-glow bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground">
              {t.product.save(formatPrice(v.compareAt - v.price, locale))}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-1 px-3 pb-3 pt-4">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{l(product.tagline)}</p>
        <Link
          to="/products/$handle"
          params={{ handle: product.handle }}
          className="font-display text-xl leading-tight text-card-foreground transition-colors hover:text-primary"
        >
          {l(product.title)}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <p className="text-sm text-card-foreground">
            {multi && <span className="block text-[11px] text-muted-foreground">{t.shop.from}</span>}
            <span className="text-base font-medium">{formatPrice(lowestPrice(product), locale)}</span>
            {v.compareAt && <s className="ms-2 text-xs text-muted-foreground">{formatPrice(v.compareAt, locale)}</s>}
          </p>
          <button
            type="button"
            disabled={!available}
            onClick={() => add(v.id)}
            className="shrink-0 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground transition hover:shadow-glow active:scale-95 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            {available ? t.actions.addToCart : t.actions.soldOut}
          </button>
        </div>
      </div>
    </article>
  );
}
