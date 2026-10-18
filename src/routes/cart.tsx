import { useState } from "react";
import { seoHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { useCart, useLocale } from "@/app/providers";
import { CartLines } from "@/components/layout/CartDrawer";
import { fetchLiveShopifyProducts, findVariant, STORE_URL } from "@/data/products";
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
  const [checkingStock, setCheckingStock] = useState(false);

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    setCheckingStock(true);
    try {
      const live = await fetchLiveShopifyProducts();
      if (live.size > 0) {
        const outOfStock = lines.filter((l) => {
          const v = live.get(l.variantId);
          return v && !v.available;
        });
        if (outOfStock.length > 0) {
          const names = outOfStock.map((l) => {
            const f = findVariant(l.variantId);
            return f ? f.product.title[locale] : String(l.variantId);
          });
          toast.error(
            locale === "ar"
              ? `عذراً، بعض المنتجات في حقيبتك نفدت حالياً: ${names.join("، ")}`
              : `Sorry, some items in your bag are currently out of stock: ${names.join(", ")}`,
          );
          setCheckingStock(false);
          return;
        }
      }
    } catch {
      // Allow checkout on network error
    }
    setCheckingStock(false);
    window.open(checkoutUrl(STORE_URL, lines), "_blank", "noopener,noreferrer");
  };
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
            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingStock}
              className="mt-6 flex w-full items-center justify-center gap-2 btn-lux shadow-glow bg-primary py-3 text-center text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {checkingStock && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>{t.actions.checkout}</span>
            </button>
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
