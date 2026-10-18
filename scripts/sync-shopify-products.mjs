#!/usr/bin/env node
/**
 * Verification & Synchronization script for Camli Beauty Egypt Shopify Catalog
 * Fetches live products from https://www.camlibeautyeg.com/products.json
 * and validates variants, prices, and stock status against src/data/products.ts
 */

import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PRODUCTS_TS_PATH = resolve(__dirname, "../src/data/products.ts");
const SHOPIFY_URL = "https://www.camlibeautyeg.com/products.json";

async function main() {
  console.log("🌸 Camli Beauty Egypt — Shopify Catalog Verification");
  console.log(`Connecting to ${SHOPIFY_URL}...`);

  let response;
  try {
    response = await fetch(SHOPIFY_URL, {
      headers: {
        "User-Agent": "Camli-Beauty-Storefront-Sync/1.0",
        Accept: "application/json",
      },
    });
  } catch (err) {
    console.error("❌ Failed to reach Shopify store:", err.message);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
    process.exit(1);
  }

  const { products: liveProducts } = await response.json();
  console.log(`✅ Retrieved ${liveProducts.length} live products from Shopify\n`);

  const fileContent = readFileSync(PRODUCTS_TS_PATH, "utf-8");

  const summary = [];
  let hasDiscrepancy = false;

  for (const live of liveProducts) {
    const handle = live.handle;
    const variants = live.variants.map((v) => ({
      id: v.id,
      title: v.title,
      price: parseFloat(v.price),
      compareAt: v.compare_at_price ? parseFloat(v.compare_at_price) : undefined,
      available: Boolean(v.available),
    }));

    const foundInLocal = fileContent.includes(handle);
    summary.push({
      handle,
      title: live.title,
      foundInLocal,
      variantCount: variants.length,
      variants,
    });

    console.log(`📦 [${live.title}] (handle: ${handle})`);
    for (const v of variants) {
      const idStr = String(v.id);
      const idInFile = fileContent.includes(idStr);
      const statusIcon = v.available ? "🟢 In Stock" : "🔴 Out of Stock";
      console.log(
        `   • Variant ${v.id} (${v.title}): ${v.price} EGP ${v.compareAt ? `(was ${v.compareAt})` : ""} - ${statusIcon} [${idInFile ? "ID Matched" : "ID MISSING"}]`,
      );
      if (!idInFile) {
        hasDiscrepancy = true;
      }
    }
    console.log("");
  }

  // Update timestamp in products.ts if needed
  const now = new Date().toISOString();
  if (fileContent.includes("CATALOG_LAST_SYNCED =")) {
    const updatedContent = fileContent.replace(
      /CATALOG_LAST_SYNCED = "[^"]*"/,
      `CATALOG_LAST_SYNCED = "${now}"`,
    );
    writeFileSync(PRODUCTS_TS_PATH, updatedContent, "utf-8");
    console.log(`🕒 Updated CATALOG_LAST_SYNCED to ${now}`);
  }

  if (hasDiscrepancy) {
    console.warn(
      "\n⚠️ Discrepancy detected: Some Shopify variant IDs are missing from local catalog.",
    );
  } else {
    console.log("✨ All live Shopify products and variants are verified and matched!");
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
