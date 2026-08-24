import { create } from "zustand";
import { getService, spa, type Service } from "./spa-config";
import { generateBookingId, totalPrice } from "./availability";

export type PaymentMethod = "transfer" | "mobile";
export type LocationType = "incall" | "outcall";
export type PreferredContact = "phone" | "whatsapp" | "email";
export type BookingStatus = "pending" | "confirmed" | "rejected";

export type ClientDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  preferredContact: PreferredContact;
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
  durationHours: number;
  locationType: LocationType;
  client: ClientDetails;
  paymentMethod: PaymentMethod;
  depositOnly: boolean;
  total: number;
  paid: number;
  status: BookingStatus;
  proofDataUrl?: string | null;
};

const BOOKINGS_KEY = "velvetmoon-bookings";

const emptyClient: ClientDetails = {
  name: "",
  phone: "",
  email: "",
  address: "",
  preferredContact: "whatsapp",
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
  durationHours: number;
  locationType: LocationType | null;
  client: ClientDetails;
  paymentMethod: PaymentMethod;
  depositOnly: boolean;
  card: CardDetails;
  transferAcknowledged: boolean;
  policyAccepted: boolean;
  lastBookingId: string | null;
  selectService: (id: string) => void;
  setSelected: (ids: string[]) => void;
  setDate: (iso: string | null) => void;
  setTime: (time: string | null) => void;
  setDurationHours: (hours: number) => void;
  setLocationType: (loc: LocationType) => void;
  patchClient: (patch: Partial<ClientDetails>) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDepositOnly: (value: boolean) => void;
  patchCard: (patch: Partial<CardDetails>) => void;
  setTransferAcknowledged: (value: boolean) => void;
  setPolicyAccepted: (value: boolean) => void;
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

export function persistBooking(booking: SavedBooking) {
  const all = [booking, ...loadBookings().filter((b) => b.id !== booking.id)].slice(0, 50);
  window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
}

export function updateBookingStatus(
  id: string,
  status: BookingStatus,
  proofDataUrl?: string | null,
): SavedBooking | null {
  const existing = loadBooking(id);
  if (!existing) return null;
  const updated: SavedBooking = {
    ...existing,
    status,
    ...(proofDataUrl !== undefined ? { proofDataUrl } : {}),
  };
  persistBooking(updated);
  return updated;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  selectedIds: [],
  date: null,
  time: null,
  durationHours: 1,
  locationType: null,
  client: emptyClient,
  paymentMethod: "transfer",
  depositOnly: true,
  card: emptyCard,
  transferAcknowledged: false,
  policyAccepted: false,
  lastBookingId: null,

  selectService: (id) => set({ selectedIds: [id] }),

  setSelected: (ids) => set({ selectedIds: ids }),

  setDate: (iso) => set({ date: iso, time: null }),

  setTime: (time) => set({ time }),

  setDurationHours: (hours) =>
    set({ durationHours: Math.min(spa.maxDurationHours, Math.max(1, hours)) }),

  setLocationType: (loc) => set({ locationType: loc }),

  patchClient: (patch) =>
    set((state) => ({ client: { ...state.client, ...patch } })),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  setDepositOnly: (value) => set({ depositOnly: value }),

  patchCard: (patch) => set((state) => ({ card: { ...state.card, ...patch } })),

  setTransferAcknowledged: (value) => set({ transferAcknowledged: value }),

  setPolicyAccepted: (value) => set({ policyAccepted: value }),

  confirmBooking: () => {
    const state = get();
    const services = selectedServices(state.selectedIds);
    if (!services.length || !state.date || !state.time || !state.locationType) return null;
    if (!state.client.name.trim() || !state.client.phone.trim() || !state.client.email.trim()) {
      return null;
    }
    if (state.locationType === "outcall" && !state.client.address.trim()) return null;
    if (!state.policyAccepted) return null;

    const durationMin = state.durationHours * 60;
    const total = totalPrice(services);
    const paid = state.depositOnly
      ? Math.round(total * (spa.depositPercent / 100))
      : total;

    // Bank transfer and mobile pay start as pending until proof is verified
    const status: BookingStatus =
      state.paymentMethod === "mobile" || state.paymentMethod === "transfer"
        ? "pending"
        : "confirmed";

    const booking: SavedBooking = {
      id: generateBookingId(),
      createdAt: new Date().toISOString(),
      serviceIds: state.selectedIds,
      services: services.map((s) => ({
        id: s.id,
        name: s.name,
        durationMin,
        price: s.price,
      })),
      date: state.date,
      time: state.time,
      durationHours: state.durationHours,
      locationType: state.locationType,
      client: { ...state.client },
      paymentMethod: state.paymentMethod,
      depositOnly: state.depositOnly,
      total,
      paid,
      status,
      proofDataUrl: null,
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
      durationHours: 1,
      locationType: null,
      client: emptyClient,
      paymentMethod: "transfer",
      depositOnly: true,
      card: emptyCard,
      transferAcknowledged: false,
      policyAccepted: false,
    }),
}));

export function bookingTotals(ids: string[], depositOnly: boolean, durationHours?: number) {
  const services = selectedServices(ids);
  const duration = durationHours ? durationHours * 60 : services.reduce((s, x) => s + x.durationMin, 0);
  const total = totalPrice(services);
  const deposit = Math.round(total * (spa.depositPercent / 100));
  const dueNow = depositOnly ? deposit : total;
  const remainder = total - dueNow;
  return { services, duration, total, deposit, dueNow, remainder };
}
