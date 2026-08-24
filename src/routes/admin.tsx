import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { MoonMark } from "@/components/spa/moon-mark";
import { Button } from "@/components/ui/button";
import {
  loadBookings,
  updateBookingStatus,
  type BookingStatus,
  type SavedBooking,
} from "@/lib/booking-store";
import { spa } from "@/lib/spa-config";
import { formatPrice, formatTimeDisplay } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const [bookings, setBookings] = useState<SavedBooking[]>([]);

  function refresh() {
    setBookings(loadBookings());
  }

  useEffect(() => {
    refresh();
  }, []);

  function setStatus(id: string, status: BookingStatus) {
    const updated = updateBookingStatus(id, status);
    if (updated) {
      toast.success(
        status === "confirmed"
          ? "Booking confirmed"
          : status === "rejected"
            ? "Booking rejected"
            : "Status updated",
      );
      refresh();
    }
  }

  const pending = bookings.filter((b) => b.status === "pending");
  const others = bookings.filter((b) => b.status !== "pending");

  return (
    <div className="page-shell min-h-screen">
      <header className="border-b border-plum/8">
        <div className="narrow flex h-14 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <MoonMark className="size-7" />
            <span className="font-serif text-base font-semibold text-plum-deep">
              {spa.name}
            </span>
          </Link>
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Admin
          </span>
        </div>
      </header>

      <main className="narrow space-y-8 px-5 py-8">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-plum-deep">
            Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Verify payment screenshots and confirm or reject appointments.
            Data is stored in this browser only.
          </p>
        </div>

        <section>
          <h2 className="section-label">Pending payment ({pending.length})</h2>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">
              No pending bookings.
            </p>
          ) : (
            <div className="mt-3 space-y-4">
              {pending.map((b) => (
                <BookingRow key={b.id} booking={b} onStatus={setStatus} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="section-label">All others ({others.length})</h2>
          {others.length === 0 ? (
            <p className="mt-3 text-sm text-muted-foreground">None yet.</p>
          ) : (
            <div className="mt-3 space-y-4">
              {others.map((b) => (
                <BookingRow key={b.id} booking={b} onStatus={setStatus} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function BookingRow({
  booking,
  onStatus,
}: {
  booking: SavedBooking;
  onStatus: (id: string, status: BookingStatus) => void;
}) {
  const when = `${format(parseISO(booking.date), "EEE d MMM")} · ${formatTimeDisplay(booking.time)}`;

  return (
    <article className="soft-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-serif text-lg text-plum-deep tabular-nums">
            {booking.id}
          </p>
          <p className="text-sm text-muted-foreground">
            {booking.client.name} · {booking.client.phone}
          </p>
          <p className="mt-1 text-sm">
            {when} · {booking.services.map((s) => s.name).join(", ")}
          </p>
          <p className="mt-1 text-sm tabular-nums">
            Due {formatPrice(booking.paid)} ·{" "}
            <span className="capitalize">{booking.status}</span> ·{" "}
            {booking.paymentMethod}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {booking.status !== "confirmed" ? (
            <Button size="sm" onClick={() => onStatus(booking.id, "confirmed")}>
              Confirm
            </Button>
          ) : null}
          {booking.status !== "rejected" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onStatus(booking.id, "rejected")}
            >
              Reject
            </Button>
          ) : null}
        </div>
      </div>
      {booking.proofDataUrl ? (
        <div className="mt-3">
          <p className="mb-1 text-xs text-muted-foreground">Payment proof</p>
          <img
            src={booking.proofDataUrl}
            alt="Proof"
            className="max-h-56 rounded-xl object-contain bg-cream-deep"
          />
        </div>
      ) : booking.paymentMethod === "mobile" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          No screenshot uploaded yet.
        </p>
      ) : null}
    </article>
  );
}
