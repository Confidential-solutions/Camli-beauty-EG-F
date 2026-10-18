import { Component, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";
import { useLocale } from "@/app/providers";
import { extras } from "@/i18n/extras";
import { reportApplicationError } from "@/lib/error-reporting";

/** Isolates a widget so its crash never takes down the page. */
export class WidgetBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    reportApplicationError(error, { boundary: "widget_boundary" });
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function NotFoundView() {
  const { t } = useLocale();
  const digits = ["4", "0", "4"];
  return (
    <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
      <motion.div
        aria-hidden
        className="absolute h-[28rem] w-[28rem] rounded-full bg-glow blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative text-center">
        <div className="flex justify-center gap-2" dir="ltr">
          {digits.map((d, i) => (
            <motion.span
              key={i}
              className="font-display text-[8rem] leading-none text-primary md:text-[11rem]"
              initial={{ y: 60, opacity: 0, rotate: -8 }}
              animate={{ y: [0, -14, 0], opacity: 1, rotate: 0 }}
              transition={{
                opacity: { delay: i * 0.12, duration: 0.5 },
                rotate: { delay: i * 0.12, duration: 0.5 },
                y: { delay: 0.6 + i * 0.2, duration: 2.4, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {d}
            </motion.span>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="mt-2 font-display text-3xl text-foreground">{t.notFound.title}</h1>
          <p className="mx-auto mt-3 max-w-sm text-muted-foreground">{t.notFound.body}</p>
          <Link
            to="/"
            className="btn-lux shadow-glow mt-8 inline-flex items-center gap-2 bg-primary px-6 py-3 text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" /> {t.notFound.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export function ErrorView({ onRetry }: { onRetry: () => void }) {
  let locale: "en" | "ar" = "en";
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    locale = useLocale().locale;
  } catch {
    /* rendered outside providers */
  }
  const e = extras[locale].error;
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card-lux max-w-md p-10 text-center"
      >
        <motion.div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary"
          animate={{ rotate: [0, -10, 10, -6, 6, 0] }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AlertTriangle className="h-7 w-7" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl text-foreground">{e.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{e.body}</p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={onRetry}
            className="btn-lux shadow-glow inline-flex items-center gap-2 bg-primary px-5 py-2.5 text-primary-foreground"
          >
            <RotateCcw className="h-4 w-4" /> {e.retry}
          </button>
          <a href="/" className="btn-lux border border-border px-5 py-2.5 text-foreground">
            {e.home}
          </a>
        </div>
      </motion.div>
    </section>
  );
}

/** Router-level error boundary: retries the loader, then resets. */
export function RouteErrorView({ reset }: { error: unknown; reset: () => void }) {
  return <ErrorView onRetry={() => reset()} />;
}
