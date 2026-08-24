import { Link } from "@tanstack/react-router";
import { Clock, Instagram, Mail, Phone } from "lucide-react";
import { Expandable } from "@/components/spa/expandable";
import { BrandLogo } from "@/components/spa/moon-mark";
import { ServiceCard } from "@/components/spa/service-card";
import { SiteFooter } from "@/components/spa/site-footer";
import { SiteHeader } from "@/components/spa/site-header";
import { Button } from "@/components/ui/button";
import {
  about,
  contact,
  hours,
  policies,
  services,
  spa,
} from "@/lib/spa-config";
import { useBookingStore } from "@/lib/booking-store";
import { cn } from "@/lib/utils";

export function LandingPage() {
  const selectedIds = useBookingStore((s) => s.selectedIds);
  const selectService = useBookingStore((s) => s.selectService);
  const selectedCount = selectedIds.length;

  return (
    <div className="page-shell overflow-x-hidden">
      <div className={cn(selectedCount > 0 && "pb-24")}>
        <SiteHeader />
        <main className="narrow px-5">
          <section className="stagger-in pt-6 pb-12 text-center">
            {/* Brand banner */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#100e12] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
              <img
                src={spa.bannerSrc ?? "/banner-hero.svg"}
                alt=""
                className="h-auto w-full object-cover"
                width={1200}
                height={480}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#100e12]/40 via-transparent to-transparent" />
            </div>

            <div className="mt-10">
              <BrandLogo className="mx-auto h-12 w-auto max-w-[260px] sm:h-14" />
              <p className="section-label mt-6">Private wellness</p>
              <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight text-plum-deep sm:text-4xl">
                {spa.name}
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-base leading-relaxed text-muted-foreground">
                {spa.tagline}
              </p>
              <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Select your preferred massage, choose an available appointment
                time, and securely complete your booking.
              </p>
              <Button asChild size="lg" className="mt-7 min-w-40">
                <Link to="/book">Book Your Private Massage</Link>
              </Button>
            </div>
          </section>

          <div className="hairline" />

          <section className="py-8" id="about">
            <p className="section-label">About</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-plum-deep">
              {about.headline}
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-foreground/85">
              {about.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </section>

          <div className="hairline" />

          <section className="py-8" id="policies">
            <p className="section-label">Policy & terms</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-plum-deep">
              How we care for your booking
            </h2>
            <Expandable
              className="mt-4"
              moreLabel="Show more"
              preview={
                <ol className="space-y-3">
                  {policies.slice(0, 3).map((item, i) => (
                    <li key={item.title} className="flex gap-3 text-sm leading-relaxed">
                      <span className="mt-0.5 w-5 shrink-0 font-medium tabular-nums text-champagne">
                        {i + 1}.
                      </span>
                      <span>
                        <span className="font-medium text-foreground">{item.title}. </span>
                        <span className="text-muted-foreground">{item.body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              }
            >
              <ol className="mt-3 space-y-3" start={4}>
                {policies.slice(3).map((item, i) => (
                  <li key={item.title} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-0.5 w-5 shrink-0 font-medium tabular-nums text-champagne">
                      {i + 4}.
                    </span>
                    <span>
                      <span className="font-medium text-foreground">{item.title}. </span>
                      <span className="text-muted-foreground">{item.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Expandable>
          </section>

          <div className="hairline" />

          <section className="py-8" id="contact">
            <p className="section-label">Contact</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-plum-deep">
              Contact
            </h2>
            <ul className="mt-4 space-y-1">
              <li>
                <a
                  href={`tel:${contact.phone.tel}`}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground"
                >
                  <Phone className="size-4 text-champagne" />
                  {contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsapp.url}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground"
                >
                  <Phone className="size-4 text-champagne" />
                  WhatsApp {contact.phone.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.email.href}
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-foreground"
                >
                  <Mail className="size-4 text-champagne" />
                  {contact.email.display}
                </a>
              </li>
              <li>
                <a
                  href={contact.instagram.url}
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-plum"
                >
                  <Instagram className="size-4" />
                  {contact.instagram.handle}
                </a>
              </li>
            </ul>
          </section>

          <div className="hairline" />

          <section className="py-8" id="hours">
            <p className="section-label">Hours</p>
            <h2 className="mt-2 flex items-center gap-2 font-serif text-2xl font-semibold text-plum-deep">
              <Clock className="size-4 text-champagne" />
              Business hours
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              All times in {spa.timezoneLabel}
            </p>
            <ul className="mt-4 divide-y divide-plum/8">
              {hours.map((row) => (
                <li
                  key={row.day}
                  className="flex items-center justify-between py-2.5 text-sm"
                >
                  <span className="text-foreground">{row.day}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {row.open && row.close ? `${row.open} – ${row.close}` : "Closed"}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <div className="hairline" />

          <section className="py-8" id="services">
            <p className="section-label">All services</p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-plum-deep">
              Treatments
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose a treatment below, or start the full booking flow.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  selected={selectedIds.includes(service.id)}
                  onSelect={() => selectService(service.id)}
                />
              ))}
            </div>
          </section>
        </main>
        <SiteFooter />
      </div>

      {selectedCount > 0 ? (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#100e12]/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
          <div className="narrow flex items-center justify-between gap-3 px-5 py-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-plum-deep">
                {selectedCount} {selectedCount === 1 ? "service" : "services"} selected
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {selectedIds
                  .map((id) => services.find((s) => s.id === id)?.name)
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            <Button asChild>
              <Link to="/book">Continue</Link>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
