import { Link } from "@tanstack/react-router";
import { useLocale } from "@/app/providers";

/** Policy page for topics the official store has not published wording for. */
export function PolicyPage({ title }: { title: string }) {
  const { t } = useLocale();
  return (
    <div className="container-lux max-w-3xl py-16">
      <h1 className="font-display text-5xl text-foreground">{title}</h1>
      <p className="mt-6 leading-relaxed text-muted-foreground">{t.pages.policyBody}</p>
      <Link to="/contact" className="mt-8 inline-block btn-lux shadow-glow bg-primary px-8 py-3.5 text-primary-foreground">
        {t.pages.policyCta}
      </Link>
    </div>
  );
}
