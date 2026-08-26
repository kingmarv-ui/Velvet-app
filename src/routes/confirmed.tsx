import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { CalendarPlus, Check, Clock, Upload } from "lucide-react";
import { toast } from "sonner";
import { SiteFooter } from "@/components/spa/site-footer";
import { MoonMark } from "@/components/spa/moon-mark";
import { Button } from "@/components/ui/button";
import type { SavedBooking } from "@/lib/booking-store";
import { getBookingFn, uploadProofFn } from "@/lib/bookings.server";
import { bankTransfer, contact, spa } from "@/lib/spa-config";
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
  const [booking, setBooking] = useState<SavedBooking | null | undefined>(
    undefined,
  );

  async function refresh() {
    if (!id) {
      setBooking(null);
      return;
    }
    try {
      const row = await getBookingFn({ data: { id } });
      setBooking(row);
    } catch {
      setBooking(null);
    }
  }

  useEffect(() => {
    void refresh();
  }, [id]);

  return (
    <div className="page-shell">
      <header className="border-b border-white/8">
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
            <div className="mx-auto size-16 animate-pulse rounded-full bg-white/10" />
            <div className="mx-auto h-8 w-48 animate-pulse rounded bg-white/10" />
            <div className="h-40 animate-pulse rounded-2xl bg-white/10" />
          </div>
        ) : booking === null ? (
          <EmptyConfirmation />
        ) : booking.status === "pending" ? (
          <PendingCard booking={booking} onUpdated={refresh} />
        ) : booking.status === "rejected" ? (
          <RejectedCard booking={booking} />
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
        Double-check the link, or start a new appointment anytime.
      </p>
      <Button asChild className="mt-6">
        <Link to="/book">Book now</Link>
      </Button>
    </div>
  );
}

function PendingCard({
  booking,
  onUpdated,
}: {
  booking: SavedBooking;
  onUpdated: () => void;
}) {
  const when = `${format(parseISO(booking.date), "EEEE, d MMMM yyyy")} at ${formatTimeDisplay(booking.time)}`;
  const [uploading, setUploading] = useState(false);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image screenshot.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      void (async () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : null;
        if (!dataUrl) {
          toast.error("Could not read that file.");
          setUploading(false);
          return;
        }
        try {
          await uploadProofFn({
            data: { id: booking.id, proofDataUrl: dataUrl },
          });
          toast.success("Screenshot uploaded. We’ll verify and confirm shortly.");
          onUpdated();
        } catch {
          toast.error("Could not upload screenshot. Please try again.");
        } finally {
          setUploading(false);
        }
      })();
    };
    reader.onerror = () => {
      toast.error("Could not read that file.");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }

  const waMsg = encodeURIComponent(
    `Hello Velvetmoon Spa 👋\n\nI just completed my booking online.\n\nService: ${booking.services.map((s) => s.name).join(", ")}\nDate: ${when}\nTime: ${formatTimeDisplay(booking.time)}\nAmount: ${formatPrice(booking.paid)}\n\nI will love to send the payment via Zelle / Cash App / Venmo / PayPal / Apple Giftcard shortly.\n\nPlease confirm once received. Thank you!`,
  );
  const waUrl = `https://wa.me/14246662911?text=${waMsg}`;

  return (
    <div className="text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-champagne/20 text-champagne">
        <Clock className="size-8" strokeWidth={2} />
      </div>
      <p className="section-label mt-6">Pending payment</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-plum-deep">
        Almost there
      </h1>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Your appointment is reserved. Complete payment
        {booking.paymentMethod === "transfer"
          ? " by bank transfer"
          : " via Zelle, Cash App, Venmo, PayPal, or Apple Gift Card"}
        , then upload a screenshot so we can confirm.
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
          {booking.client.name} · Due now {formatPrice(booking.paid)}
        </p>
        <ul className="mt-4 divide-y divide-plum/8">
          {booking.services.map((s) => (
            <li key={s.id} className="flex justify-between gap-3 py-2.5 text-sm">
              <span>{s.name}</span>
              <span className="tabular-nums">{formatPrice(s.price)}</span>
            </li>
          ))}
        </ul>
      </div>

      {booking.paymentMethod === "transfer" ? (
        <div className="soft-card mt-6 space-y-2 p-4 text-left text-sm">
          <p className="font-medium text-plum-deep">Bank transfer details</p>
          <p><span className="text-muted-foreground">Account name:</span> {bankTransfer.accountName}</p>
          <p><span className="text-muted-foreground">Bank:</span> {bankTransfer.bank}</p>
          <p><span className="text-muted-foreground">Account number:</span> {bankTransfer.accountNumber}</p>
          <p><span className="text-muted-foreground">Routing:</span> {bankTransfer.routing}</p>
          <p className="text-xs text-muted-foreground">{bankTransfer.note}</p>
        </div>
      ) : null}

      <div className="mt-6 space-y-3">
        {booking.paymentMethod === "mobile" ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Open WhatsApp
          </a>
        ) : null}

        <div className="soft-card p-4 text-left">
          <p className="text-sm font-medium text-plum-deep">
            Upload payment screenshot
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            After sending payment, upload a clear screenshot of the transfer
            confirmation.
          </p>
          {booking.proofDataUrl ? (
            <div className="mt-3 space-y-2">
              <img
                src={booking.proofDataUrl}
                alt="Payment proof"
                className="max-h-48 w-full rounded-xl object-contain bg-white/10"
              />
              <p className="text-xs text-muted-foreground">
                Screenshot received. We’ll verify and confirm your appointment.
              </p>
            </div>
          ) : (
            <label className="mt-3 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full border border-dashed border-champagne/40 bg-card px-4 text-sm font-medium text-plum transition-colors hover:bg-white/10">
              <Upload className="size-4" />
              {uploading ? "Uploading…" : "Choose screenshot"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={onFileChange}
              />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}

function RejectedCard({ booking }: { booking: SavedBooking }) {
  return (
    <div className="text-center">
      <h1 className="font-serif text-3xl font-semibold text-plum-deep">
        Payment not verified
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        We couldn’t verify payment for booking{" "}
        <span className="font-medium tabular-nums">{booking.id}</span>. Please
        contact us on WhatsApp to resolve this.
      </p>
      <Button asChild className="mt-6">
        <a href={contact.whatsapp.url} target="_blank" rel="noreferrer">
          Contact on WhatsApp
        </a>
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
        className="mx-auto flex size-16 items-center justify-center rounded-full bg-champagne text-primary-foreground"
        style={{
          animation: "check-pop 400ms cubic-bezier(0.22, 1, 0.36, 1) both",
        }}
      >
        <Check className="size-8" strokeWidth={2.2} />
      </div>
      <p className="section-label mt-6">You’re booked</p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-plum-deep">
        Appointment confirmed
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thank you. Your appointment is confirmed.
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
            label={booking.depositOnly ? "Deposit" : "Paid"}
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
            value={
              booking.paymentMethod === "transfer"
                ? "Bank transfer"
                : "Mobile pay"
            }
          />
        </div>
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
  const duration =
    booking.durationHours * 60 ||
    booking.services.reduce((s, x) => s + x.durationMin, 0);
  const start = parseISO(`${booking.date}T${booking.time}:00`);
  const end = new Date(start.getTime() + duration * 60_000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${spa.name} — ${booking.services.map((s) => s.name).join(", ")}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `Booking ${booking.id}`,
    location: "Velvetmoon Spa",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
