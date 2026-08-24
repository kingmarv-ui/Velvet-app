/**
 * Velvetmoon Spa — editable content.
 * Update services, prices, hours, contact, address, and policies here.
 */

export const spa = {
  name: "Velvetmoon Spa",
  wordmark: "Velvetmoon",
  tagline: "Luxury wellness, delivered with intention",
  shortLocation: "West Village, New York",
  timezoneLabel: "Eastern Time",
  depositPercent: 50,
  bookingLeadHours: 2,
  bookingWindowDays: 60,
  slotIntervalMin: 30,
} as const;

export const about = {
  headline: "A quieter kind of luxury",
  body: [
    "Velvetmoon Spa is a sanctuary for unhurried care. Our therapists blend classical technique with a quietly luxurious touch — warm rooms, considered products, and treatments paced to your body rather than the clock.",
    "Whether you join us in-studio or we come to you, every session is designed to feel private, professional, and deeply restorative.",
  ],
};

export const contact = {
  instagram: {
    handle: "@velvetmoonspa",
    url: "https://instagram.com/velvetmoonspa",
  },
  phone: {
    display: "+1 (212) 555-0148",
    tel: "+12125550148",
  },
  whatsapp: {
    display: "WhatsApp",
    url: "https://wa.me/12125550148",
  },
  email: {
    display: "hello@velvetmoonspa.com",
    href: "mailto:hello@velvetmoonspa.com",
  },
};

export const address = {
  line1: "14 Moonstone Lane",
  line2: "West Village, New York, NY 10014",
  mapsUrl:
    "https://www.google.com/maps/dir/?api=1&destination=14%20Moonstone%20Lane%2C%20West%20Village%2C%20New%20York%2C%20NY%2010014",
  mapsLabel: "Open in Google Maps",
};

export type DayHours = {
  day: string;
  /** 24h "HH:mm", or null when closed */
  open: string | null;
  close: string | null;
};

export const hours: DayHours[] = [
  { day: "Sunday", open: "10:00", close: "16:00" },
  { day: "Monday", open: null, close: null },
  { day: "Tuesday", open: "10:00", close: "19:00" },
  { day: "Wednesday", open: "10:00", close: "19:00" },
  { day: "Thursday", open: "10:00", close: "19:00" },
  { day: "Friday", open: "10:00", close: "20:00" },
  { day: "Saturday", open: "09:00", close: "18:00" },
];

export const policies = [
  {
    title: "Professional services only",
    body: "Velvetmoon Spa provides wellness and therapeutic treatments exclusively. We do not offer any inappropriate, sexual, or out-of-scope services. Bookings that imply otherwise will be cancelled without refund of the deposit.",
  },
  {
    title: "Cancellation & reschedule",
    body: "Please give at least 24 hours’ notice to cancel or reschedule. Changes made with less than 24 hours’ notice, or missed appointments, forfeit the deposit. We will always try to rebook you when we can.",
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
  bank: "First National Bank",
  accountName: "Velvetmoon Spa LLC",
  accountNumber: "4412 8890 3321",
  routing: "021000021",
  note: "Use your booking reference as the payment description so we can match it quickly.",
};

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
  /** Optional upper bound when a range is shown */
  priceTo?: number;
  featured?: boolean;
};

export const services: Service[] = [
  {
    id: "signature-full-body",
    name: "Signature Velvetmoon Full Body Massage",
    description:
      "Our namesake ritual. Slow, flowing strokes from scalp to feet, warmed oil, and a pace that lets the nervous system truly settle. Ideal if you want to leave heavier than you arrived — in the best way.",
    durationMin: 90,
    price: 220,
    featured: true,
  },
  {
    id: "deep-tissue",
    name: "Deep Tissue Therapy",
    description:
      "Focused, unhurried work for stubborn tension in the back, neck, and hips. Pressure is collaborative — we go as deep as your body allows, never further.",
    durationMin: 75,
    price: 185,
  },
  {
    id: "aromatherapy",
    name: "Aromatherapy Massage",
    description:
      "A full-body massage scented to your mood: calming lavender and chamomile, or a brighter citrus blend. Soft lighting, warm linens, and room to breathe.",
    durationMin: 75,
    price: 195,
  },
  {
    id: "hot-stone",
    name: "Hot Stone Ritual",
    description:
      "Smooth basalt stones, heated and placed along the spine, then used as an extension of the therapist’s hands. Melts guarding in the shoulders and lower back.",
    durationMin: 90,
    price: 240,
  },
  {
    id: "couples",
    name: "Couples Massage",
    description:
      "Two tables, one quiet room. Side-by-side massages timed together so you finish in the same breath. A considered way to mark an occasion — or an ordinary Tuesday.",
    durationMin: 90,
    price: 380,
  },
  {
    id: "four-hands",
    name: "Four Hands Massage",
    description:
      "Two therapists, one synchronized rhythm. Covering more of the body at once, this is immersive and surprisingly meditative — a Velvetmoon favourite.",
    durationMin: 60,
    price: 280,
  },
  {
    id: "scrub-polish",
    name: "Body Scrub & Polish",
    description:
      "A mineral-and-oil polish that sloughs dullness and leaves skin velvety. Finished with a hydrating balm. Beautiful on its own, or before a massage.",
    durationMin: 45,
    price: 140,
  },
  {
    id: "facial-glow",
    name: "Facial Glow Treatment",
    description:
      "A tailored facial: cleanse, exfoliate, massage, mask, and glow. Products are chosen for your skin that day — not a one-size protocol.",
    durationMin: 60,
    price: 165,
  },
  {
    id: "luxury-packages",
    name: "Luxury Spa Packages",
    description:
      "A composed half-day: scrub, signature massage, and facial, with tea between treatments. Final pairing is confirmed after we speak — the range reflects duration and add-ins.",
    durationMin: 150,
    price: 420,
    priceTo: 560,
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getHoursForDayName(dayName: string): DayHours | undefined {
  return hours.find((h) => h.day === dayName);
}
