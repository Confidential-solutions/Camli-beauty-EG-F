export interface CartLine {
  variantId: number;
  quantity: number;
}

export const MAX_QTY = 10;

export function addLine(lines: CartLine[], variantId: number, qty = 1): CartLine[] {
  const existing = lines.find((l) => l.variantId === variantId);
  if (existing) {
    return lines.map((l) =>
      l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + qty) } : l,
    );
  }
  return [...lines, { variantId, quantity: Math.min(MAX_QTY, Math.max(1, qty)) }];
}

export function setQty(lines: CartLine[], variantId: number, qty: number): CartLine[] {
  if (qty <= 0) return lines.filter((l) => l.variantId !== variantId);
  return lines.map((l) => (l.variantId === variantId ? { ...l, quantity: Math.min(MAX_QTY, qty) } : l));
}

export function subtotal(lines: CartLine[], priceOf: (id: number) => number | undefined): number {
  return lines.reduce((sum, l) => sum + (priceOf(l.variantId) ?? 0) * l.quantity, 0);
}

/** Shopify cart permalink: hands the cart to the official Camli store checkout. */
export function checkoutUrl(store: string, lines: CartLine[]): string {
  return `${store}/cart/${lines.map((l) => `${l.variantId}:${l.quantity}`).join(",")}`;
}

export function formatPrice(amount: number, locale: "en" | "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(amount);
}
