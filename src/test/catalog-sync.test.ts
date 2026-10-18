import { describe, expect, it } from "vitest";
import { defaultVariant, isAvailable, lowestPrice, products, type Product } from "@/data/products";
import { resolveProduct, resolveVariant } from "@/lib/shopify-catalog";

describe("Catalog & Live Shopify Synchronization", () => {
  it("resolves lowest price across variants correctly", () => {
    const eyeBoba = products.find((p) => p.handle === "eye-boba")!;
    expect(lowestPrice(eyeBoba)).toBe(280);
  });

  it("identifies availability based on in-stock variants", () => {
    const hibDilka = products.find((p) => p.handle === "nayra-hibiscus-dilka")!;
    expect(isAvailable(hibDilka)).toBe(true);

    const mockupProduct: Product = {
      ...hibDilka,
      variants: [{ id: 999, title: { en: "Test", ar: "تجربة" }, price: 100, available: false }],
    };
    expect(isAvailable(mockupProduct)).toBe(false);
  });

  it("selects the first available variant as default", () => {
    const jar = products.find((p) => p.handle === "nayra-whipped-baked-body-butter-jar")!;
    const def = defaultVariant(jar);
    expect(def.available).toBe(true);
    expect(def.id).toBe(47916790284426); // Berry mix is available
  });

  it("merges live variant availability and price updates seamlessly", () => {
    const baseVariant = {
      id: 50087972339850,
      title: { en: "12 pairs", ar: "١٢ زوجاً" },
      price: 570,
      compareAt: 840,
      available: true,
    };

    const liveMap = new Map([
      [50087972339850, { id: 50087972339850, price: 590, compareAt: 890, available: false }],
    ]);

    const resolved = resolveVariant(baseVariant, liveMap);
    expect(resolved.price).toBe(590);
    expect(resolved.compareAt).toBe(890);
    expect(resolved.available).toBe(false);
  });

  it("falls back to static variant data if live map does not contain the variant", () => {
    const baseVariant = {
      id: 111111,
      title: { en: "Test", ar: "تجربة" },
      price: 450,
      available: true,
    };

    const emptyLiveMap = new Map();
    const resolved = resolveVariant(baseVariant, emptyLiveMap);
    expect(resolved.price).toBe(450);
    expect(resolved.available).toBe(true);
  });

  it("resolves full product variants with live updates", () => {
    const eyeBoba = products.find((p) => p.handle === "eye-boba")!;
    const liveMap = new Map([
      [50088004354186, { id: 50088004354186, price: 300, compareAt: 350, available: true }],
    ]);

    const updated = resolveProduct(eyeBoba, liveMap);
    const box4 = updated.variants.find((v) => v.id === 50088004354186)!;
    expect(box4.available).toBe(true);
    expect(box4.price).toBe(300);
  });
});
