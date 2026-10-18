import { describe, expect, it } from "vitest";
import { addLine, checkoutUrl, setQty, subtotal } from "@/lib/cart";
import { findVariant } from "@/data/products";

describe("cart rules", () => {
  it("merges the same variant and caps quantity at 10", () => {
    let lines = addLine([], 1, 8);
    lines = addLine(lines, 1, 5);
    expect(lines).toEqual([{ variantId: 1, quantity: 10 }]);
  });
  it("removes a line when quantity drops to 0", () => {
    expect(setQty([{ variantId: 1, quantity: 2 }], 1, 0)).toEqual([]);
  });
  it("computes subtotal in EGP from real store prices", () => {
    const price = (id: number) => findVariant(id)?.variant.price;
    // Eye Boba 12 pairs = 570, Orange Dilka = 490
    expect(subtotal([{ variantId: 50087972339850, quantity: 2 }, { variantId: 44496825057418, quantity: 1 }], price)).toBe(1630);
  });
  it("builds a Shopify cart permalink for checkout", () => {
    expect(checkoutUrl("https://www.camlibeautyeg.com", [{ variantId: 5, quantity: 2 }, { variantId: 7, quantity: 1 }])).toBe(
      "https://www.camlibeautyeg.com/cart/5:2,7:1",
    );
  });
});
