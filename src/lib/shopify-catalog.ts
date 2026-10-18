import { useQuery } from "@tanstack/react-query";
import {
  fetchLiveShopifyProducts,
  type LiveVariantUpdate,
  type Product,
  type Variant,
} from "@/data/products";

/**
 * React hook to fetch live product stock and pricing from Shopify.
 * Cached for 5 minutes via TanStack Query.
 */
export function useLiveShopifyCatalog() {
  return useQuery<Map<number, LiveVariantUpdate>>({
    queryKey: ["shopify-live-catalog"],
    queryFn: fetchLiveShopifyProducts,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

/**
 * Merge static product data with live variant availability and prices.
 */
export function resolveVariant(
  variant: Variant,
  liveMap?: Map<number, LiveVariantUpdate>,
): Variant {
  if (!liveMap) return variant;
  const live = liveMap.get(variant.id);
  if (!live) return variant;
  const compareAt = live.compareAt ?? variant.compareAt;
  return {
    ...variant,
    price: live.price,
    ...(compareAt !== undefined && { compareAt }),
    available: live.available,
  };
}

export function resolveProduct(
  product: Product,
  liveMap?: Map<number, LiveVariantUpdate>,
): Product {
  if (!liveMap || liveMap.size === 0) return product;
  const updatedVariants = product.variants.map((v) => resolveVariant(v, liveMap));
  return {
    ...product,
    variants: updatedVariants,
  };
}
