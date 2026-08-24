/**
 * Velvetmoon Spa — editable content.
 * Update services, prices, hours, and contact here.
 * Contact: +1 (424) 666-2911
 */

export const spa = {
  name: "Velvetmoon Spa",
  wordmark: "Velvetmoon",
  tagline: "Luxury wellness, delivered with intention",
  timezoneLabel: "Eastern Time",
  depositPercent: 50,
  bookingLeadHours: 2,
  bookingWindowDays: 60,
  slotIntervalMin: 30,
  maxDurationHours: 2,
  logoSrc: null as string | null,
} as const;

export const about = {
  headline: "A quieter kind of luxury",
  body: [
    "Velvetmoon Spa is a sanctuary for unhurried care. Our therapists blend classical technique with a quietly luxurious touch — warm rooms, considered products, and treatments paced to your body rather than the clock.",
    "Every session is designed to feel private, professional, and deeply restorative. Book in advance, arrive as you are, and leave lighter.",
  ],
};

export const contact = {
  instagram: {
    handle: "@velvetmoonspa",
    url: "https://instagram.com/velvetmoonspa",
  },
  phone: {
    display: "+1 (424) 666-2911",
    tel: "+14246662911",
  },
  whatsapp: {
    display: "WhatsApp",
    url: "https://wa.me/14246662911?text=Hello%2C%20I%20want%20to%20book%20a%20spa%20appointment",
  },
  email: {
    display: "bookings@velvetmoonspa.com",
    href: "mailto:bookings@velvetmoonspa.com",
  },
};

export type DayHours = {
  day: string;
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { day: "Sunday", open: null, close: null },
  { day: "Monday", open: "07:00", close: "23:00" },
  { day: "Tuesday", open: "07:00", close: "23:00" },
  { day: "Wednesday", open: "07:00", close: "23:00" },
  { day: "Thursday", open: "07:00", close: "23:00" },
  { day: "Friday", open: "07:00", close: "23:00" },
  { day: "Saturday", open: "07:00", close: "23:00" },
];

export const policies = [
  {
    title: "Professional services only",
    body: "Velvetmoon Spa provides wellness and therapeutic treatments exclusively. We do not offer any inappropriate, sexual, or out-of-scope services. Bookings that imply otherwise will be cancelled without refund of the deposit.",
  },
  {
    title: "Cancellation & reschedule",
    body: "Please give at least 24 hours' notice to cancel or reschedule. Changes made with less than 24 hours' notice, or missed appointments, forfeit the deposit. We will always try to rebook you when we can.",
  },
  {
    title: "Deposit to confirm",
    body: "A 50% deposit is required to complete and confirm your booking. The remaining balance is due at the start of your appointment. Deposits are applied in full toward your treatment.",
  },
  {
    title: "Arrival",
    body: "Kindly arrive 10 minutes early so we can settle you in. Late arrivals may shorten the treatment so the next guest is not delayed. If you are running behind, a quick message helps us hold the room.",
  },
  {
    title: "Health & comfort",
    body: "Share allergies, injuries, pregnancy, or medical conditions in the notes when you book — or tell your therapist before we begin. We reserve the right to adapt or decline a treatment when it would not be safe.",
  },
  {
    title: "Hygiene & respect",
    body: "Please reschedule if you are unwell. Draping is always used; undress only to your comfort. Phones on silent, and a quiet room for you and for others.",
  },
];

export const bankTransfer = {
  accountName: "Marvelous Adewusi",
  bank: "Lead Bank",
  accountNumber: "219951648589",
  accountType: "Checking",
  routing: "101019644",
  note: "Use your booking reference as the payment description so we can match it quickly.",
};

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  priceTo?: number;
  featured?: boolean;
  highlights?: string[];
};

export const services: Service[] = [
  {
    id: "velvet-signature",
    name: "Velvet Signature Massage",
    description: "Relaxation-focused personalized massage.",
    durationMin: 60,
    price: 100,
    featured: true,
  },
  {
    id: "luxe-touch",
    name: "Luxe Touch Massage",
    description: "Premium full-body relaxation with customized attention.",
    durationMin: 60,
    price: 150,
  },
  {
    id: "signature-full-body",
    name: "Signature Full-Body Massage",
    description: "Comprehensive full-body massage experience.",
    durationMin: 60,
    price: 250,
  },
  {
    id: "private-luxe-retreat",
    name: "Private Luxe Retreat",
    description: "Elevated private massage with personalized attention.",
    durationMin: 60,
    price: 400,
  },
  {
    id: "premium-sensation",
    name: "Premium Sensation Massage",
    description: "Premium customized massage and relaxation experience.",
    durationMin: 60,
    price: 500,
  },
  {
    id: "executive-private",
    name: "Executive Private Massage",
    description: "An extended, highly personalized private massage experience.",
    durationMin: 120,
    price: 750,
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}
