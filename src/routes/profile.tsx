import { seoHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, LogOut, Package, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { OFFICIAL_SHOPIFY_ACCOUNT_URL, useAccount } from "@/app/account";
import { useLocale } from "@/app/providers";

export const Route = createFileRoute("/profile")({
  head: () =>
    seoHead({
      path: "/profile",
      title: "My Profile — Camli Beauty Egypt",
      description: "Your Camli guest profile, preferences, and official store account link.",
      keywords: [],
      noindex: true,
    }),
  component: Profile,
});

function Profile() {
  const { user, ex, openAuth, logout, updateName } = useAccount();
  const { locale } = useLocale();
  const p = ex.profile;
  const [name, setName] = useState(user?.name ?? "");
  useEffect(() => setName(user?.name ?? ""), [user?.name]);

  if (!user)
    return (
      <section className="container-lux flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="font-display text-4xl text-foreground">{p.title}</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{p.guest}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => openAuth("login")}
            className="btn-lux shadow-glow bg-primary px-6 py-3 text-primary-foreground"
          >
            {ex.auth.signIn}
          </button>
          <a
            href={OFFICIAL_SHOPIFY_ACCOUNT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-lux inline-flex items-center gap-2 border border-border px-6 py-3 text-foreground hover:bg-secondary"
          >
            <span>{p.officialBtn}</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </section>
    );

  const initials = user.name
    .split(" ")
    .map((x) => x[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const save = (e: FormEvent) => {
    e.preventDefault();
    const v = name.trim();
    if (!v) {
      toast.error(ex.auth.errName);
      return;
    }
    updateName(v);
    toast.success(p.saved);
  };

  return (
    <section className="container-lux py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary font-display text-2xl text-primary-foreground shadow-glow">
            {initials}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate font-display text-4xl text-foreground">{user.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                {p.badge}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {p.member}{" "}
              {new Date(user.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
              })}
            </p>
          </div>
        </div>

        <a
          href={OFFICIAL_SHOPIFY_ACCOUNT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-lux inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs font-medium text-foreground hover:bg-secondary"
        >
          <span>{p.officialBtn}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <form onSubmit={save} className="card-lux p-8">
          <h2 className="font-display text-2xl text-foreground">{p.account}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{p.disclaimer}</p>

          <label className="mt-6 block text-sm text-muted-foreground">
            {ex.auth.name}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="mt-4 block text-sm text-muted-foreground">
            {ex.auth.email}
            <input
              value={user.email}
              disabled
              className="mt-2 w-full rounded-lg border border-border bg-secondary px-4 py-3 text-muted-foreground"
            />
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-lux shadow-glow bg-primary px-5 py-2.5 text-primary-foreground"
            >
              {p.save}
            </button>
            <button
              type="button"
              onClick={logout}
              className="btn-lux inline-flex items-center gap-2 border border-border px-5 py-2.5 text-foreground hover:bg-secondary"
            >
              <LogOut className="h-4 w-4" /> {p.signOut}
            </button>
          </div>
        </form>

        <div className="card-lux flex flex-col p-8">
          <h2 className="font-display text-2xl text-foreground">{p.orders}</h2>
          <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
            <Package className="h-10 w-10 text-primary" />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">{p.noOrders}</p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={OFFICIAL_SHOPIFY_ACCOUNT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lux shadow-glow inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-primary-foreground"
              >
                <span>{p.officialBtn}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                to="/shop"
                className="btn-lux border border-border px-5 py-2.5 text-foreground hover:bg-secondary"
              >
                {p.shop}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
