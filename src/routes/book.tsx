import { createFileRoute } from "@tanstack/react-router";
import { BookingFlow } from "@/components/book/booking-flow";
import { SITE_URL } from "@/lib/seo";

const title = "Book a Private Massage in Texas | Velvet Moon Wellness";
const description =
  "Choose your massage, pick a time, and hold your appointment with a 50% deposit. Serving Texas and nearby areas within about two hours.";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/book` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/book` }],
  }),
});

function BookPage() {
  return <BookingFlow />;
}
