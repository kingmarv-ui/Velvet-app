import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfDay } from "date-fns";
import "react-day-picker/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingTotals, useBookingStore } from "@/lib/booking-store";
import {
  earliestBookableDate,
  getTimeSlots,
  isClosedOn,
  latestBookableDate,
} from "@/lib/availability";
import { spa } from "@/lib/spa-config";
import { cn, formatDuration, formatTimeDisplay } from "@/lib/utils";

export function StepSchedule() {
  const selectedIds = useBookingStore((s) => s.selectedIds);
  const dateIso = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const client = useBookingStore((s) => s.client);
  const setDate = useBookingStore((s) => s.setDate);
  const setTime = useBookingStore((s) => s.setTime);
  const patchClient = useBookingStore((s) => s.patchClient);
  const { duration } = bookingTotals(selectedIds, true);

  const selectedDate = dateIso ? parseISO(dateIso) : undefined;
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!dateIso) return;
    setSlotsLoading(true);
    const t = window.setTimeout(() => setSlotsLoading(false), 180);
    return () => window.clearTimeout(t);
  }, [dateIso]);

  const slots = useMemo(() => {
    if (!selectedDate || duration <= 0) return [];
    return getTimeSlots(selectedDate, duration);
  }, [selectedDate, duration]);

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-plum-deep">
          Date, time & details
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {duration > 0
            ? `Your visit is about ${formatDuration(duration)}. Times in ${spa.timezoneLabel}.`
            : "Select a service first so we can offer the right length of appointment."}
        </p>
      </div>

      <section>
        <p className="section-label">Date</p>
        <div className="soft-card mt-3 overflow-visible p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => setDate(d ? format(d, "yyyy-MM-dd") : null)}
            disabled={[
              { before: startOfDay(new Date()) },
              { after: latestBookableDate() },
              isClosedOn,
            ]}
            startMonth={earliestBookableDate()}
            endMonth={latestBookableDate()}
          />
        </div>
      </section>

      <section>
        <p className="section-label">Available times</p>
        {!selectedDate ? (
          <p className="mt-3 rounded-xl bg-cream-deep/70 px-4 py-6 text-center text-sm text-muted-foreground">
            Choose a date to see open times.
          </p>
        ) : slotsLoading ? (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-11 animate-pulse rounded-full bg-cream-deep"
              />
            ))}
          </div>
        ) : availableCount === 0 ? (
          <p className="mt-3 rounded-xl bg-cream-deep/70 px-4 py-6 text-center text-sm text-muted-foreground">
            {isClosedOn(selectedDate)
              ? "We’re closed this day. Please pick another date."
              : "This day is fully reserved. Please choose another date."}
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => setTime(slot.time)}
                className={cn(
                  "h-11 rounded-full text-sm tabular-nums transition-[background-color,color,box-shadow] duration-150",
                  slot.available
                    ? time === slot.time
                      ? "bg-plum text-primary-foreground"
                      : "bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-plum)]"
                    : "cursor-not-allowed bg-cream-deep/60 text-muted-foreground/50 line-through",
                )}
              >
                {formatTimeDisplay(slot.time)}
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <p className="section-label">Your details</p>
        <div className="space-y-1.5">
          <Label htmlFor="client-name">Full name</Label>
          <Input
            id="client-name"
            autoComplete="name"
            placeholder="Avery Moon"
            value={client.name}
            onChange={(e) => patchClient({ name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-phone">Phone</Label>
          <Input
            id="client-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (212) 555-0148"
            value={client.phone}
            onChange={(e) => patchClient({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={client.email}
            onChange={(e) => patchClient({ email: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-notes">Notes</Label>
          <Textarea
            id="client-notes"
            placeholder="Pressure preference, allergies, pregnancy, areas to avoid…"
            value={client.notes}
            onChange={(e) => patchClient({ notes: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Optional — anything that helps us take better care of you.
          </p>
        </div>
      </section>
    </div>
  );
}

export function scheduleReady(
  date: string | null,
  time: string | null,
  name: string,
  phone: string,
  email: string,
): boolean {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  return Boolean(date && time && name.trim().length > 1 && phone.trim().length >= 8 && emailOk);
}
