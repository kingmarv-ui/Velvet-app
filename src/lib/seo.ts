import { contact, hours, services, spa } from "@/lib/spa-config";

export const SITE_URL = "https://velvetmoonspa.com";

export const defaultDescription =
  "Private massage in Texas and surrounding areas within about two hours. Book online with a 50% deposit. Incall and outcall. From $100.";

function dayNameToSchema(day: string): string {
  return `https://schema.org/${day}`;
}

export function businessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HealthAndBeautyBusiness",
        "@id": `${SITE_URL}/#business`,
        name: spa.name,
        url: SITE_URL,
        image: `${SITE_URL}/og.jpg`,
        telephone: contact.phone.tel,
        email: contact.email.display,
        priceRange: "$100-$750",
        description: defaultDescription,
        areaServed: spa.serviceArea.map((name) => ({
          "@type": "State",
          name,
        })),
        openingHoursSpecification: hours
          .filter((h) => h.open && h.close)
          .map((h) => ({
            "@type": "OpeningHoursSpecification",
            dayOfWeek: dayNameToSchema(h.day),
            opens: h.open,
            closes: h.close,
          })),
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Massage treatments",
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.name,
              description: s.description,
            },
            price: s.price,
            priceCurrency: "USD",
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: spa.name,
        publisher: { "@id": `${SITE_URL}/#business` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the session completely private?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Every appointment is private and discreet. You will not be interrupted.",
            },
          },
          {
            "@type": "Question",
            name: "Where do you serve?",
            acceptedAnswer: {
              "@type": "Answer",
              text: spa.serviceAreaLine,
            },
          },
          {
            "@type": "Question",
            name: "How does the deposit work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "A 50% deposit holds your preferred time and is applied in full toward your treatment. The remaining balance is due at the start of your appointment.",
            },
          },
        ],
      },
    ],
  };
}
