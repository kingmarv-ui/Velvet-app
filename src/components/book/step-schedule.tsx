import { useEffect, useMemo, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, parseISO, startOfDay } from "date-fns";
import "react-day-picker/style.css";
import { useBookingStore } from "@/lib/booking-store";
import {
  earliestBookableDate,
  getTimeSlots,
  isClosedOn,
  latestBookableDate,
} from "@/lib/availability";
import { spa } from "@/lib/spa-config";
import { cn, formatDuration, formatTimeDisplay } from "@/lib/utils";

export function StepSchedule() {
  const dateIso = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const durationHours = useBookingStore((s) => s.durationHours);
  const locationType = useBookingStore((s) => s.locationType);
  const setDate = useBookingStore((s) => s.setDate);
  const setTime = useBookingStore((s) => s.setTime);
  const setDurationHours = useBookingStore((s) => s.setDurationHours);
  const setLocationType = useBookingStore((s) => s.setLocationType);

  const durationMin = durationHours * 60;
  const selectedDate = dateIso ? parseISO(dateIso) : undefined;
  const [slotsLoading, setSlotsLoading] = useState(false);

  useEffect(() => {
    if (!dateIso) return;
    setSlotsLoading(true);
    const t = window.setTimeout(() => setSlotsLoading(false), 180);
    return () => window.clearTimeout(t);
  }, [dateIso, durationHours]);

  const slots = useMemo(() => {
    if (!selectedDate || durationMin <= 0) return [];
    return getTimeSlots(selectedDate, durationMin);
  }, [selectedDate, durationMin]);

  const availableCount = slots.filter((s) => s.available).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-plum-deep">
          Choose your appointment
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Select a date, arrival time, duration, and whether we host you or come
          to you. Times in {spa.timezoneLabel}.
        </p>
      </div>

      <section>
        <p className="section-label">Date</p>
        <div className="soft-card mt-3 overflow-visible p-3">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(d) => {
              setDate(d ? format(d, "yyyy-MM-dd") : null);
              setTime(null);
            }}
            disabled={[
              { before: startOfDay(new Date()) },
              { before: earliestBookableDate() },
              { after: latestBookableDate() },
              (date) => isClosedOn(date),
            ]}
            className="mx-auto"
          />
        </div>
      </section>

      <section>
        <p className="section-label">Duration</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[1, 2].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => {
                setDurationHours(h);
                setTime(null);
              }}
              className={cn(
                "flex min-h-14 flex-col items-start justify-center rounded-2xl px-4 py-3 text-left transition-[box-shadow]",
                durationHours === h
                  ? "bg-card shadow-[0_0_0_1.5px_var(--color-champagne)]"
                  : "bg-card shadow-[var(--shadow-border)]",
              )}
            >
              <span className="text-sm font-medium text-plum-deep">
                {h} hour{h > 1 ? "s" : ""}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDuration(h * 60)}
              </span>
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Maximum {spa.maxDurationHours} hours per appointment.
        </p>
      </section>

      <section>
        <p className="section-label">Location</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLocationType("incall")}
            className={cn(
              "flex min-h-16 flex-col items-start justify-center rounded-2xl px-4 py-3 text-left transition-[box-shadow]",
              locationType === "incall"
                ? "bg-card shadow-[0_0_0_1.5px_var(--color-champagne)]"
                : "bg-card shadow-[var(--shadow-border)]",
            )}
          >
            <span className="text-sm font-medium text-plum-deep">Incall</span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              Address shared after booking is confirmed
            </span>
          </button>
          <button
            type="button"
            onClick={() => setLocationType("outcall")}
            className={cn(
              "flex min-h-16 flex-col items-start justify-center rounded-2xl px-4 py-3 text-left transition-[box-shadow]",
              locationType === "outcall"
                ? "bg-card shadow-[0_0_0_1.5px_var(--color-champagne)]"
                : "bg-card shadow-[var(--shadow-border)]",
            )}
          >
            <span className="text-sm font-medium text-plum-deep">Outcall</span>
            <span className="mt-0.5 text-xs text-muted-foreground">
              We come to you — full address required next
            </span>
          </button>
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between gap-2">
          <p className="section-label">Arrival time</p>
          {dateIso && !slotsLoading ? (
            <p className="text-xs text-muted-foreground">
              {availableCount} available
            </p>
          ) : null}
        </div>
        {!dateIso ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Choose a date to see open times.
          </p>
        ) : slotsLoading ? (
          <p className="mt-3 text-sm text-muted-foreground">Loading times…</p>
        ) : slots.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No times available for this date and duration. Try another day.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot.time}
                type="button"
                disabled={!slot.available}
                onClick={() => setTime(slot.time)}
                className={cn(
                  "h-11 rounded-full text-sm font-medium transition-[box-shadow,background-color]",
                  slot.available
                    ? time === slot.time
                      ? "bg-champagne text-primary-foreground"
                      : "bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)] hover:shadow-[0_0_0_1px_var(--color-champagne)]"
                    : "cursor-not-allowed bg-white/5 text-muted-foreground/50 line-through",
                )}
              >
                {formatTimeDisplay(slot.time)}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function scheduleReady(
  date: string | null,
  time: string | null,
  locationType: "incall" | "outcall" | null,
  durationHours: number,
): boolean {
  return Boolean(
    date &&
      time &&
      locationType &&
      durationHours >= 1 &&
      durationHours <= spa.maxDurationHours,
  );
}
