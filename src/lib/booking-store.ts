import { create } from "zustand";
import { getService, spa, type Service } from "./spa-config";
import { generateBookingId, totalDuration, totalPrice } from "./availability";

export type PaymentMethod = "card" | "transfer";

export type ClientDetails = {
  name: string;
  phone: string;
  email: string;
  notes: string;
};

export type CardDetails = {
  holder: string;
  number: string;
  expiry: string;
  cvc: string;
};

export type SavedBooking = {
  id: string;
  createdAt: string;
  serviceIds: string[];
  services: { id: string; name: string; durationMin: number; price: number }[];
  date: string;
  time: string;
  client: ClientDetails;
  paymentMethod: PaymentMethod;
  depositOnly: boolean;
  total: number;
  paid: number;
};

const BOOKINGS_KEY = "velvetmoon-bookings";

const emptyClient: ClientDetails = {
  name: "",
  phone: "",
  email: "",
  notes: "",
};

const emptyCard: CardDetails = {
  holder: "",
  number: "",
  expiry: "",
  cvc: "",
};

type BookingState = {
  selectedIds: string[];
  date: string | null;
  time: string | null;
  client: ClientDetails;
  paymentMethod: PaymentMethod;
  depositOnly: boolean;
  card: CardDetails;
  transferAcknowledged: boolean;
  lastBookingId: string | null;
  toggleService: (id: string) => void;
  setSelected: (ids: string[]) => void;
  setDate: (iso: string | null) => void;
  setTime: (time: string | null) => void;
  patchClient: (patch: Partial<ClientDetails>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDepositOnly: (value: boolean) => void;
  patchCard: (patch: Partial<CardDetails>) => void;
  setTransferAcknowledged: (value: boolean) => void;
  confirmBooking: () => SavedBooking | null;
  resetFlow: () => void;
};

export function selectedServices(ids: string[]): Service[] {
  return ids.map(getService).filter((s): s is Service => Boolean(s));
}

export function loadBookings(): SavedBooking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedBooking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function loadBooking(id: string): SavedBooking | undefined {
  return loadBookings().find((b) => b.id === id);
}

function persistBooking(booking: SavedBooking) {
  const all = [booking, ...loadBookings().filter((b) => b.id !== booking.id)].slice(0, 30);
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedIds: [],
  date: null,
  time: null,
  client: emptyClient,
  paymentMethod: "card",
  depositOnly: true,
  card: emptyCard,
  transferAcknowledged: false,
  lastBookingId: null,

  toggleService: (id) =>
    set((state) => {
      const exists = state.selectedIds.includes(id);
      return {
        selectedIds: exists
          ? state.selectedIds.filter((x) => x !== id)
          : [...state.selectedIds, id],
      };
    }),

  setSelected: (ids) => set({ selectedIds: ids }),

  setDate: (iso) => set({ date: iso, time: null }),

  setTime: (time) => set({ time }),

  patchClient: (patch) =>
    set((state) => ({ client: { ...state.client, ...patch } })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setDepositOnly: (value) => set({ depositOnly: value }),

  patchCard: (patch) => set((state) => ({ card: { ...state.card, ...patch } })),

  setTransferAcknowledged: (value) => set({ transferAcknowledged: value }),

  confirmBooking: () => {
    const state = get();
    const services = selectedServices(state.selectedIds);
    if (!services.length || !state.date || !state.time) return null;
    if (!state.client.name.trim() || !state.client.phone.trim() || !state.client.email.trim()) {
      return null;
    }

    const total = totalPrice(services);
    const paid = state.depositOnly
      ? Math.round(total * (spa.depositPercent / 100))
      : total;

    const booking: SavedBooking = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      serviceIds: state.selectedIds,
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        durationMin: s.durationMin,
        price: s.price,
      })),
      date: state.date,
      time: state.time,
      client: { ...state.client },
      paymentMethod: state.paymentMethod,
      depositOnly: state.depositOnly,
      total,
      paid,
    };

    persistBooking(booking);
    set({ lastBookingId: booking.id });
    return booking;
  },

  resetFlow: () =>
    set({
      selectedIds: [],
      date: null,
      time: null,
      client: emptyClient,
      paymentMethod: "card",
      depositOnly: true,
      card: emptyCard,
      transferAcknowledged: false,
    }),
}));

export function bookingTotals(ids: string[], depositOnly: boolean) {
  const services = selectedServices(ids);
  const duration = totalDuration(services);
  const total = totalPrice(services);
  const deposit = Math.round(total * (spa.depositPercent / 100));
  const dueNow = depositOnly ? deposit : total;
  const remainder = total - dueNow;
  return { services, duration, total, deposit, dueNow, remainder };
}
