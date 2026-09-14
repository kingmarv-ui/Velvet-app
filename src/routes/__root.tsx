import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/react";
import appCss from "../styles.css?url";
import { FAVICON_PNG_SRC } from "@/lib/brand-assets";
import { businessJsonLd, defaultDescription, SITE_URL } from "@/lib/seo";

const APP_NAME = "Velvet Moon Wellness";
const jsonLd = JSON.stringify(businessJsonLd());

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: `Private Massage in Texas | ${APP_NAME}` },
      { name: "description", content: defaultDescription },
      { name: "theme-color", content: "#100e12" },
      { name: "pst-verify", content: "4ZsfOjNpF5iFR72p" },
      { name: "geo.region", content: "US-TX" },
      { name: "geo.placename", content: "Texas" },
      { property: "og:title", content: `Private Massage in Texas | ${APP_NAME}` },
      { property: "og:description", content: defaultDescription },
      { property: "og:image", content: `${SITE_URL}/og.jpg` },
      { property: "og:url", content: SITE_URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/png", sizes: "32x32", href: FAVICON_PNG_SRC },
      { rel: "apple-touch-icon", href: FAVICON_PNG_SRC },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Outfit:wght@300;400;500;600&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
    ],
  }),
  component: () => (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <head>
        <meta name="pst-verify" content="4ZsfOjNpF5iFR72p" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "font-sans !bg-card !text-foreground !border-border !shadow-[var(--shadow-border)]",
          }}
        />
        <SpeedInsights />
        <Scripts />
      </body>
    </html>
  ),
});
