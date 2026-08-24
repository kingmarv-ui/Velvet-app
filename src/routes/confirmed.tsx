import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { CalendarPlus, Check } from "lucide-react";
import { SiteFooter } from "@/components/spa/site-footer";
import { MoonMark } from "@/components/spa/moon-mark";
import { Button } from "@/components/ui/button";
import { loadBooking, type SavedBooking } from "@/lib/booking-store";
import { spa } from "@/lib/spa-config";
import { formatDuration, formatPrice, formatTimeDisplay } from "@/lib/utils";

type Search = { id: string };

export const Route = createFileRoute("/confirmed")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    id: typeof raw.id === "string" ? raw.id : "",
  }),
  component: ConfirmedPage,
});

function ConfirmedPage() {
  const { id } = Route.useSearch();
  const [booking, setBooking] = useState<SavedBooking | null | undefined>(undefined);

  useEffect(() => {
    setBooking(id ? loadBooking(id) ?? null : null);
  }, [id]);

  return (
    <div className="page-shell">
      <header className="border-b border-plum/8">
        <div className="narrow flex h-14 items-center justify-center px-5">
          <Link to="/" className="flex items-center gap-2">
            <MoonMark className="size-7" />
            <span className="font-serif text-base font-semibold text-plum-deep">
              {spa.name}
            </span>
          </Link>
        </div>
      </header>
      <main className="narrow px-5 py-10">
        {booking === undefined ? (
          <div className="space-y-3">
            <div className="mx-auto size-16 animate-pulse rounded-full bg-cream-deep" />
            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-cream-deep" />
            <div className="h-40 animate-pulse rounded-2xl bg-cream-deep" />
          </div>
        ) : booking === null ? (
          <EmptyConfirmation />
        ) : (
          <ConfirmationCard booking={booking} />
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function EmptyConfirmation() {
  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl font-semibold text-plum-deep">
        We couldn’t find that booking
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        It may have been on another device. Start a new appointment anytime.
      </p>
      <Button asChild className="mt-6">
        <Link to="/book">Book now</Link>
      </Button>
    </div>
  );
}

function ConfirmationCard({ booking }: { booking: SavedBooking }) {
  const when = `${format(parseISO(booking.date), "EEEE, d MMMM yyyy")} at ${formatTimeDisplay(booking.time)}`;
  const calendarUrl = googleCalendarUrl(booking);

  return (
    <div className="text-center">
      <div
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-plum text-primary-foreground"
        style={{ animation: "check-pop 400ms cubic-bezier(0.22, 1, 0.36, 1) both" }}
      >
        <Check className="size-8" strokeWidth={2.2} />
      </div>
      <p className="section-label mt-6">You’re booked</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-plum-deep">
        Appointment confirmed
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        A summary is ready below. Please keep your reference for the deposit.
      </p>

      <div className="soft-card mt-8 p-5 text-left">
        <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
          Reference
        </p>
        <p className="mt-1 font-serif text-2xl text-plum-deep tabular-nums">
          {booking.id}
        </p>
        <p className="mt-4 text-sm font-medium text-plum-deep">{when}</p>
        <p className="text-sm text-muted-foreground">
          {booking.client.name} · {spa.timezoneLabel}
        </p>
        <ul className="mt-4 divide-y divide-plum/8">
          {booking.services.map((s) => (
            <li key={s.id} className="flex justify-between gap-3 py-2.5 text-sm">
              <span>
                {s.name}
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {formatDuration(s.durationMin)}
                </span>
              </span>
              <span className="tabular-nums">{formatPrice(s.price)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 text-sm">
          <Row label="Total" value={formatPrice(booking.total)} />
          <Row
            label={booking.depositOnly ? "Deposit paid" : "Paid"}
            value={formatPrice(booking.paid)}
          />
          {booking.total - booking.paid > 0 ? (
            <Row
              label="Due at appointment"
              value={formatPrice(booking.total - booking.paid)}
            />
          ) : null}
          <Row
            label="Payment"
            value={booking.paymentMethod === "card" ? "Card (demo)" : "Bank transfer"}
          />
        </div>
        {booking.client.notes ? (
          <p className="mt-4 text-sm text-muted-foreground">
            Notes: {booking.client.notes}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <Button asChild variant="outline">
          <a href={calendarUrl} target="_blank" rel="noreferrer">
            <CalendarPlus className="size-4" />
            Add to calendar
          </a>
        </Button>
        <Button asChild>
          <Link to="/">Back to Velvetmoon</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}

function googleCalendarUrl(booking: SavedBooking) {
  const duration = booking.services.reduce((s, x) => s + x.durationMin, 0);
  const start = parseISO(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + duration * 60_000);
  const fmt = (d: Date) =>
    d
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${spa.name} — ${booking.services.map((s) => s.name).join(", ")}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Booking ${booking.id}`,
    location: "Velvetmoon Spa",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
