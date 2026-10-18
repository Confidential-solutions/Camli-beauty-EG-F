import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";

describe("Route Tree Coverage", () => {
  const router = createRouter({
    routeTree,
    context: { queryClient: new QueryClient() },
  });

  const criticalRoutes = [
    "/",
    "/shop",
    "/best-sellers",
    "/about",
    "/contact",
    "/cart",
    "/shipping",
    "/privacy",
    "/terms",
    "/profile",
    "/search",
  ];

  it.each(criticalRoutes)("successfully matches route %s", (path) => {
    const matches = router.matchRoutes(path);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("successfully matches dynamic product handle route", () => {
    const matches = router.matchRoutes("/products/nayra-hibiscus-dilka");
    expect(matches.length).toBeGreaterThan(0);
    expect(matches.at(-1)?.routeId).toContain("products");
  });
});
