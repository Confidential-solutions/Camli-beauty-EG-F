import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const Route = createFileRoute("/shipping")({
  head: () =>
    seoHead({
      path: "/shipping",
      title: "Shipping & Returns in Egypt — Camli Beauty",
      description:
        "Delivery times, shipping costs and returns for Camli Beauty orders across Cairo and all of Egypt.",
      keywords: ["shipping Egypt", "delivery Cairo", "returns"],
    }),
  component: Shipping,
});

function Shipping() {
  const { t } = useLocale();
  return <PolicyPage title={t.pages.shipping} />;
}
