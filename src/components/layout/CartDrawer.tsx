import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, useLocale } from "@/app/providers";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { findVariant, STORE_URL } from "@/data/products";
import { checkoutUrl, formatPrice, MAX_QTY } from "@/lib/cart";

export function CartDrawer() {
  const { t, locale } = useLocale();
  const { lines, open, setOpen, subtotal } = useCart();
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side={locale === "ar" ? "left" : "right"} className="flex w-full flex-col bg-background sm:max-w-md">
        <SheetTitle className="shrink-0 border-b border-border pb-4 pe-12 font-display text-2xl">{t.cart.title}</SheetTitle>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">{t.cart.empty}</p>
            <Link to="/shop" onClick={() => setOpen(false)} className="btn-lux shadow-glow bg-primary px-6 py-3 text-primary-foreground">
              {t.actions.shopAll}
            </Link>
          </div>
        ) : (
          <>
            <div className="-mx-2 min-h-0 flex-1 overflow-y-auto"><CartLines /></div>
            <div className="shrink-0 border-t border-border pt-4">
              <div className="flex justify-between text-foreground">
                <span>{t.cart.subtotal}</span>
                <span className="font-medium">{formatPrice(subtotal, locale)}</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{t.cart.note}</p>
              <a
                href={checkoutUrl(STORE_URL, lines)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 block btn-lux shadow-glow bg-primary py-3 text-center text-primary-foreground transition hover:opacity-90"
              >
                {t.actions.checkout}
              </a>
              <Link to="/cart" onClick={() => setOpen(false)} className="mt-2 block w-full py-2 text-center text-sm text-foreground underline-offset-4 hover:underline">
                {t.pages.viewFull}
              </Link>
              <button onClick={() => setOpen(false)} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground">
                {t.actions.continue}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export function CartLines() {
  const { t, l, locale } = useLocale();
  const { lines, update } = useCart();
  return (
    <ul className="divide-y divide-border">
      {lines.map((line) => {
        const f = findVariant(line.variantId);
        if (!f) return null;
        const multi = f.product.variants.length > 1;
        return (
          <li key={line.variantId} className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 px-2 py-4 sm:gap-4">
            <img src={f.product.images[0]} alt="" className="h-16 w-16 shrink-0 rounded-xl product-stage product-cutout p-1.5 sm:h-20 sm:w-20" />
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-foreground">{l(f.product.title)}</p>
              {multi && <p className="text-xs text-muted-foreground">{l(f.variant.title)}</p>}
              <p className="text-sm text-foreground">{formatPrice(f.variant.price * line.quantity, locale)}</p>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex items-center rounded-full border border-border">
                  <button className="p-2" onClick={() => update(line.variantId, line.quantity - 1)} aria-label="-">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-6 text-center text-sm">{line.quantity}</span>
                  <button
                    className="p-2 disabled:opacity-40"
                    disabled={line.quantity >= MAX_QTY}
                    onClick={() => update(line.variantId, line.quantity + 1)}
                    aria-label="+"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button onClick={() => update(line.variantId, 0)} className="ms-auto p-2 text-muted-foreground hover:text-destructive" aria-label={t.actions.remove}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
