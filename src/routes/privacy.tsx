import { seoHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";
import { STORE_URL } from "@/data/products";

export const Route = createFileRoute("/privacy")({
  head: () =>
    seoHead({
      path: "/privacy",
      title: "Privacy Policy — Camli Beauty Egypt",
      description:
        "How Camli Beauty Egypt collects, uses and protects your personal information when you shop dilka and body care online.",
      keywords: ["privacy policy"],
    }),
  component: Privacy,
});

function Privacy() {
  const { t } = useLocale();
  return (
    <div className="container-lux max-w-3xl py-16">
      <h1 className="font-display text-5xl text-foreground">{t.privacy.title}</h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">{t.privacy.body}</p>
      <a
        href={`${STORE_URL}/policies/privacy-policy`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block btn-lux shadow-glow bg-primary px-8 py-3.5 text-primary-foreground"
      >
        {t.privacy.cta}
      </a>
    </div>
  );
}
