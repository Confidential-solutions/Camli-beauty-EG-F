import { seoHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart, useLocale } from "@/app/providers";
import { CartLines } from "@/components/layout/CartDrawer";
import { STORE_URL } from "@/data/products";
import { checkoutUrl, formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/cart")({
  head: () =>
    seoHead({
      path: "/cart",
      title: "Your Cart — Camli Beauty Egypt",
      description: "Review your Camli Beauty products before checkout.",
      keywords: [],
      noindex: true,
    }),
  component: CartPage,
});

function CartPage() {
  const { t, locale } = useLocale();
  const { lines, subtotal } = useCart();
  return (
    <div className="container-lux max-w-5xl py-16">
      <h1 className="font-display text-5xl text-foreground">{t.pages.cartPage}</h1>
      {lines.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">{t.cart.empty}</p>
          <Link
            to="/shop"
            className="btn-lux shadow-glow bg-primary px-6 py-3 text-primary-foreground"
          >
            {t.actions.shopAll}
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem]">
          <CartLines />
          <aside className="h-fit rounded-2xl border border-border bg-card p-6">
            <div className="flex justify-between text-foreground">
              <span>{t.cart.subtotal}</span>
              <span className="font-medium">{formatPrice(subtotal, locale)}</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{t.cart.note}</p>
            <a
              href={checkoutUrl(STORE_URL, lines)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block btn-lux shadow-glow bg-primary py-3 text-center text-primary-foreground transition hover:opacity-90"
            >
              {t.actions.checkout}
            </a>
            <Link
              to="/shop"
              className="mt-2 block py-2 text-center text-sm text-muted-foreground hover:text-foreground"
            >
              {t.actions.continue}
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
