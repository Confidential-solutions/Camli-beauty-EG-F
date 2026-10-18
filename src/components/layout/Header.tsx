import { Logo } from "@/components/shared/Logo";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart, useLocale, useTheme } from "@/app/providers";
import { AccountButton, NotificationBell } from "@/components/layout/HeaderExtras";
import { WidgetBoundary } from "@/components/shared/Boundaries";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { products, lowestPrice } from "@/data/products";
import { formatPrice } from "@/lib/cart";

const iconBtn = "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-foreground transition hover:bg-secondary sm:h-10 sm:w-10";

export function Header() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggle } = useTheme();
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const links = [
    { to: "/", label: t.nav.home },
    { to: "/shop", label: t.nav.shop },
    { to: "/best-sellers", label: t.nav.best },
    { to: "/about", label: t.nav.about },
    { to: "/contact", label: t.nav.contact },
  ] as const;

  return (
    <>
      <div className="bg-primary px-4 py-2 text-center text-xs tracking-wide text-primary-foreground">{t.announce}</div>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container-lux grid h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-1 sm:gap-4 lg:flex lg:justify-between">
          <button className={`${iconBtn} lg:hidden`} onClick={() => setMenu(true)} aria-label={t.actions.menu}>
            <Menu className="h-5 w-5" />
          </button>
          <Link to="/" aria-label="Camli" className="flex min-w-0 items-center">
            <Logo className="h-6 max-w-full sm:h-8" />
          </Link>
          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((x) => (
              <Link
                key={x.to}
                to={x.to}
                activeOptions={{ exact: true }}
                className="text-xs uppercase tracking-[0.22em] text-muted-foreground transition hover:text-foreground data-[status=active]:text-foreground"
              >
                {x.label}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
            <button className={iconBtn} onClick={() => setSearch(true)} aria-label={t.actions.search}>
              <Search className="h-5 w-5" />
            </button>
            <button
              className="hidden h-10 rounded-full px-3 text-sm text-foreground transition hover:bg-secondary sm:inline-flex sm:items-center"
              onClick={() => setLocale(locale === "en" ? "ar" : "en")}
              lang={locale === "en" ? "ar" : "en"}
            >
              {locale === "en" ? "العربية" : "English"}
            </button>
            <button
              className={iconBtn}
              onClick={(e) => {
                const b = e.currentTarget.getBoundingClientRect();
                toggle({ x: b.left + b.width / 2, y: b.top + b.height / 2 });
              }}
              aria-label={t.actions.theme}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={theme}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <WidgetBoundary><NotificationBell /></WidgetBoundary>
            <WidgetBoundary><AccountButton /></WidgetBoundary>
            <button className={`${iconBtn} relative`} onClick={() => setOpen(true)} aria-label={`${t.actions.cart} (${count})`}>
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center btn-lux shadow-glow bg-primary px-1 text-[10px] text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <Sheet open={menu} onOpenChange={setMenu}>
        <SheetContent side={locale === "ar" ? "right" : "left"} className="w-80 bg-background">
          <SheetTitle className="border-b border-border pb-4 pe-12"><span className="sr-only">Camli</span><Logo className="h-8" /></SheetTitle>
          <nav className="mt-6 flex min-w-0 flex-col gap-2">
            {links.map((x) => (
              <Link key={x.to} to={x.to} onClick={() => setMenu(false)} className="rounded-lg px-3 py-3 font-display text-2xl text-foreground hover:bg-secondary">
                {x.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="mt-8 btn-lux border border-border px-4 py-2 text-sm text-foreground"
          >
            {locale === "en" ? "العربية" : "English"}
          </button>
        </SheetContent>
      </Sheet>

      <SearchDialog open={search} onOpenChange={setSearch} />
    </>
  );
}

function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, l, locale } = useLocale();
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => [p.title.en, p.title.ar, p.tagline.en, p.tagline.ar].some((x) => x.toLowerCase().includes(s)));
  }, [q]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-background">
        <DialogTitle className="sr-only">{t.actions.search}</DialogTitle>
        <div className="flex min-w-0 items-center gap-3 border-b border-border pb-3 pe-10">
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter" && q.trim()) {
                onOpenChange(false);
                navigate({ to: "/search", search: { q: q.trim() } });
              }
            }}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search.placeholder}
            aria-label={t.search.placeholder}
            className="min-w-0 flex-1 bg-transparent text-lg text-foreground outline-none placeholder:text-muted-foreground"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label={t.actions.close} className="text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <ul className="max-h-96 overflow-y-auto">
          {results.length === 0 && <li className="py-8 text-center text-muted-foreground">{t.search.none}</li>}
          {results.map((p) => (
            <li key={p.handle}>
              <Link
                to="/products/$handle"
                params={{ handle: p.handle }}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-4 rounded-xl p-2 hover:bg-secondary"
              >
                <img src={p.images[0]} alt="" className="h-14 w-14 rounded-lg product-stage product-cutout p-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground">{l(p.title)}</p>
                  <p className="text-sm text-muted-foreground">{formatPrice(lowestPrice(p), locale)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        {q.trim() && results.length > 0 && (
          <Link to="/search" search={{ q: q.trim() }} onClick={() => onOpenChange(false)} className="block border-t border-border pt-3 text-center text-sm text-foreground hover:underline">
            {t.pages.seeAll}
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
}
