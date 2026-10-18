import { PaymentLogos } from "@/components/shared/PaymentLogos";
import { Logo } from "@/components/shared/Logo";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useLocale } from "@/app/providers";
import { SOCIALS, STORE_URL } from "@/data/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Newsletter({ variant = "footer" }: { variant?: "footer" | "club" }) {
  const club = variant === "club";
  const { t } = useLocale();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "err" | "ok">("idle");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!EMAIL_RE.test(email.trim())) return setState("err");
        setState("ok");
        window.open(`${STORE_URL}/#newsletter`, "_blank", "noopener");
      }}
      className={club ? "mx-auto w-full max-w-xl" : "w-full max-w-md"}
    >
      <div className={club ? "flex flex-col gap-3 sm:flex-row" : "flex gap-2"}>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setState("idle");
          }}
          placeholder={t.newsletter.placeholder}
          aria-label={t.newsletter.placeholder}
          aria-invalid={state === "err"}
          className={`flex-1 rounded-full border border-border text-sm ${club ? "bg-background/60 px-6 py-4" : "bg-background px-5 py-3"} text-foreground outline-none transition focus:border-primary`}
        />
        <button className={club ? "whitespace-nowrap rounded-full bg-primary px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-glow transition hover:brightness-105" : "btn-lux shadow-glow bg-primary px-6 py-3 text-primary-foreground transition hover:opacity-90"}>{t.actions.subscribe}</button>
      </div>
      {state === "err" && <p className="mt-2 text-sm text-destructive">{t.newsletter.err}</p>}
      {state === "ok" && <p className="mt-2 text-sm text-muted-foreground">{t.newsletter.handoff}</p>}
    </form>
  );
}

export function Footer() {
  const { t } = useLocale();
  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="container-lux grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:grid-cols-4">
        <div className="col-span-2">
          <Logo className="h-12" />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">{t.footer.tagline}</p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">{t.footer.about}</p>
          <p className="eyebrow mb-3 mt-8">{t.footer.follow}</p>
          <ul className="flex flex-wrap gap-3 text-sm">
            {(["instagram", "facebook", "tiktok"] as const).map((k) => (
              <li key={k}>
                <a href={SOCIALS[k]} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full border border-border px-4 py-2 capitalize text-muted-foreground transition hover:border-primary hover:text-foreground">{k === "tiktok" ? "TikTok" : k}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">{t.footer.shop}</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="text-muted-foreground hover:text-foreground">{t.nav.shop}</Link></li>
            <li><Link to="/best-sellers" className="text-muted-foreground hover:text-foreground">{t.nav.best}</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4">{t.footer.info}</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">{t.nav.about}</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">{t.nav.contact}</Link></li>
            <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">{t.footer.privacy}</Link></li>
            <li><Link to="/shipping" className="text-muted-foreground hover:text-foreground">{t.pages.shipping}</Link></li>
            <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">{t.pages.terms}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border pb-28 pt-6 md:pb-6">
        <div className="container-lux grid items-center gap-4 text-center text-xs text-muted-foreground md:grid-cols-3 md:px-24">
          <p className="md:text-start">© {new Date().getFullYear()} Camli Beauty. {t.footer.rights}</p>
          <div>
            <span className="sr-only">{t.footer.pay}</span>
            <PaymentLogos />
          </div>
          <p className="font-display text-sm text-foreground md:text-end">{t.footer.made}</p>
        </div>
      </div>
    </footer>
  );
}
