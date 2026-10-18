import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
import { toast } from "sonner";
import { dictionaries, type Dict, type Locale } from "@/i18n/dictionary";
import { addLine, setQty, subtotal, type CartLine } from "@/lib/cart";
import { findVariant, type Localized } from "@/data/products";

/* ---------- Locale ---------- */
interface LocaleCtx {
  locale: Locale;
  t: Dict;
  l: (v: Localized) => string;
  setLocale: (l: Locale) => void;
}
// Keep context identity stable across hot reloads so consumers never see a stale provider.
const g = globalThis as unknown as Record<string, React.Context<unknown>>;
function stableContext<T>(key: string) {
  return (g[key] ??= createContext<unknown>(null)) as React.Context<T | null>;
}
const LocaleContext = stableContext<LocaleCtx>("__camliLocaleCtx");

/* ---------- Theme ---------- */
type Theme = "light" | "dark";
interface ThemeCtx {
  theme: Theme;
  toggle: (origin?: { x: number; y: number }) => void;
}
const ThemeContext = stableContext<ThemeCtx>("__camliThemeCtx");

/* ---------- Cart ---------- */
interface CartCtx {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (variantId: number, qty?: number) => void;
  update: (variantId: number, qty: number) => void;
}
const CartContext = stableContext<CartCtx>("__camliCartCtx");

function detectDefaultLocale(): Locale {
  if (typeof window === "undefined") return "ar";
  const stored = localStorage.getItem("camli-locale");
  if (stored === "ar" || stored === "en") return stored;
  if (navigator.language && navigator.language.startsWith("en")) return "en";
  return "ar";
}

/** Inline script run before paint: applies stored/system theme and locale to <html>. */
export const bootScript = `(function(){try{var d=document.documentElement;var t=localStorage.getItem('camli-theme');if(!t){t='dark'}if(t==='dark')d.classList.add('dark');var l=localStorage.getItem('camli-locale')||(navigator.language&&navigator.language.startsWith('en')?'en':'ar');d.lang=l;d.dir=l==='ar'?'rtl':'ltr'}catch(e){}})()`;

export function AppProviders({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectDefaultLocale);
  const [theme, setTheme] = useState<Theme>("light");
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const d = document.documentElement;
    setTheme(d.classList.contains("dark") ? "dark" : "light");
    const initialLoc = detectDefaultLocale();
    setLocaleState(initialLoc);
    d.lang = initialLoc;
    d.dir = initialLoc === "ar" ? "rtl" : "ltr";
    try {
      const c = JSON.parse(localStorage.getItem("camli-cart") || "[]");
      if (Array.isArray(c)) setLines(c.filter((x) => findVariant(x.variantId)));
    } catch {
      /* ignore corrupt cart */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem("camli-cart", JSON.stringify(lines));
  }, [lines, ready]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("camli-locale", l);
    document.documentElement.lang = l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
  }, []);

  const toggle = useCallback((origin?: { x: number; y: number }) => {
    const d = document.documentElement;
    const next: Theme = d.classList.contains("dark") ? "light" : "dark";
    const apply = () => {
      d.classList.toggle("dark", next === "dark");
      localStorage.setItem("camli-theme", next);
      setTheme(next);
    };
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const vt = (
      document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } }
    ).startViewTransition;
    if (!vt || reduce) {
      d.classList.add("theme-transition");
      apply();
      window.setTimeout(() => d.classList.remove("theme-transition"), 450);
      return;
    }
    const x = origin?.x ?? innerWidth / 2;
    const y = origin?.y ?? 0;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const tr = vt.call(document, () => flushSync(apply));
    tr.ready.then(() => {
      d.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }, []);

  const t = dictionaries[locale];
  const localeValue = useMemo<LocaleCtx>(
    () => ({ locale, t, l: (v) => v[locale], setLocale }),
    [locale, t, setLocale],
  );

  const cartValue = useMemo<CartCtx>(
    () => ({
      lines,
      open,
      setOpen,
      count: lines.reduce((s, l) => s + l.quantity, 0),
      subtotal: subtotal(lines, (id) => findVariant(id)?.variant.price),
      add: (variantId, qty = 1) => {
        const found = findVariant(variantId);
        if (!found?.variant.available) return;
        setLines((prev) => addLine(prev, variantId, qty));
        toast.success(t.cart.added, { description: found.product.title[locale] });
      },
      update: (variantId, qty) => {
        setLines((prev) => setQty(prev, variantId, qty));
        if (qty <= 0) toast(t.cart.removed);
      },
    }),
    [lines, open, t, locale],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      <LocaleContext.Provider value={localeValue}>
        <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>
      </LocaleContext.Provider>
    </ThemeContext.Provider>
  );
}

function use<T>(ctx: React.Context<T | null>, name: string): T {
  const v = useContext(ctx);
  if (!v) throw new Error(`${name} must be used within AppProviders`);
  return v;
}
export const useLocale = () => use(LocaleContext, "useLocale");
export const useTheme = () => use(ThemeContext, "useTheme");
export const useCart = () => use(CartContext, "useCart");
