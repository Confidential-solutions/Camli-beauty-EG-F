import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProviders, bootScript } from "@/app/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Toaster } from "@/components/ui/sonner";
import { AccountProvider } from "@/app/account";
import { AuthModal } from "@/components/layout/AuthModal";
import { ChatWidget } from "@/components/shared/ChatWidget";
import { ScrollTop } from "@/components/shared/ScrollTop";
import { ErrorView, NotFoundView, WidgetBoundary } from "@/components/shared/Boundaries";

function NotFoundComponent() {
  return <NotFoundView />;
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <ErrorView
      onRetry={() => {
        router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Camli Beauty Egypt" },
      { name: "description", content: "Heritage skincare rooted in Sudanese beauty rituals." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Camli Beauty Egypt" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "ar_EG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "theme-color", content: "#1a1410" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Italiana&family=Jost:wght@300;400;500&family=Cairo:wght@300;400;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Camli Beauty Egypt",
          alternateName: "كاملي بيوتي",
          url: "/",
          logo: "https://www.camlibeautyeg.com/cdn/shop/files/Camli_logo.png?v=1704291549&width=400",
          sameAs: ["https://www.camlibeautyeg.com"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppProviders>
        <AccountProvider>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <WidgetBoundary><AuthModal /></WidgetBoundary>
          <WidgetBoundary><ScrollTop /></WidgetBoundary>
          <WidgetBoundary><ChatWidget /></WidgetBoundary>
          <Toaster position="bottom-center" closeButton />
        </AccountProvider>
      </AppProviders>
    </QueryClientProvider>
  );
}
