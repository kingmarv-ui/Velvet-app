import { addDays, addMinutes, format, isBefore, parse, startOfDay } from "date-fns";
import { getHoursForDayName, spa, type Service } from "./spa-config";

function parseHm(hm: string, on: Date): Date {
  return parse(hm, "HH:mm", on);
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function isClosedOn(date: Date): boolean {
  const day = format(date, "EEEE");
  const hours = getHoursForDayName(day);
  return !hours || hours.open == null || hours.close == null;
}

export function totalDuration(selected: Service[]): number {
  return selected.reduce((sum, s) => sum + s.durationMin, 0);
}

/** Hourly-scale a service price to the chosen appointment duration. */
export function scaledServicePrice(service: Service, durationHours: number): number {
  const hours = Math.max(0.5, durationHours);
  const baseHours = Math.max(0.5, service.durationMin / 60);
  return Math.round(service.price * (hours / baseHours));
}

/** Sum of service prices. Pass durationHours to scale by appointment length. */
export function totalPrice(selected: Service[], durationHours?: number): number {
  if (durationHours == null) {
    return selected.reduce((sum, s) => sum + s.price, 0);
  }
  return selected.reduce((sum, s) => sum + scaledServicePrice(s, durationHours), 0);
}

export type TimeSlot = {
  time: string;
  available: boolean;
};

export function getTimeSlots(date: Date, durationMin: number): TimeSlot[] {
  const day = format(date, "EEEE");
  const hours = getHoursForDayName(day);
  if (!hours?.open || !hours.close) return [];

  const open = parseHm(hours.open, date);
  const close = parseHm(hours.close, date);
  const lastStart = addMinutes(close, -Math.max(durationMin, spa.slotIntervalMin));

  const now = new Date();
  const lead = addMinutes(now, spa.bookingLeadHours * 60);
  const dateKey = format(date, "yyyy-MM-dd");

  const slots: TimeSlot[] = [];
  for (let cursor = open; !isBefore(lastStart, cursor); cursor = addMinutes(cursor, spa.slotIntervalMin)) {
    const time = format(cursor, "HH:mm");
    const inPast = isBefore(cursor, lead);
    const seededBusy = hashString(`${dateKey}:${time}`) % 5 === 0;
    slots.push({
      time,
      available: !inPast && !seededBusy,
    });
  }
  return slots;
}

export function earliestBookableDate(): Date {
  return startOfDay(new Date());
}

export function latestBookableDate(): Date {
  return addDays(startOfDay(new Date()), spa.bookingWindowDays);
}

export function generateBookingId(): string {
  const stamp = format(new Date(), "yyMMdd");
  const n = Math.floor(1000 + Math.random() * 9000);
  return `VM-${stamp}-${n}`;
}
