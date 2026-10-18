import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { PolicyPage } from "@/components/shared/PolicyPage";

export const Route = createFileRoute("/terms")({
  head: () =>
    seoHead({
      path: "/terms",
      title: "Terms of Service — Camli Beauty Egypt",
      description:
        "Terms and conditions for shopping Camli Beauty dilka, body butter and skincare online in Egypt.",
      keywords: ["terms of service"],
    }),
  component: Terms,
});

function Terms() {
  const { t } = useLocale();
  return <PolicyPage title={t.pages.terms} />;
}
