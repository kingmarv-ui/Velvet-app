import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/spa/landing-page";
import { defaultDescription, SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Private Massage in Texas | Velvet Moon Wellness" },
      { name: "description", content: defaultDescription },
      { property: "og:title", content: "Private Massage in Texas | Velvet Moon Wellness" },
      { property: "og:description", content: defaultDescription },
      { property: "og:url", content: SITE_URL },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
});

function Home() {
  return <LandingPage />;
}
