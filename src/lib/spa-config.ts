/**
 * Velvetmoon Spa — editable content.
 * Update services, prices, hours, and contact here.
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
  /** Set to "/logo.png" after you add the file to public/ */
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
    display: "+1 (440) 544-5757",
    tel: "+14405445757",
  },
  whatsapp: {
    display: "WhatsApp",
    url: "https://wa.me/14405445757?text=Hello%2C%20I%20want%20to%20book%20a%20spa%20appointment",
  },
  email: {
    display: "bookings@velvetmoonspa.com",
    href: "mailto:bookings@velvetmoonspa.com",
  },
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
  highlights?: string[];
};

export const services: Service[] = [
  {
    id: "velvet-signature",
    name: "Velvet Signature Massage",
    description:
      "A personalized relaxation massage designed to ease tension and create a calm, intimate atmosphere.",
    durationMin: 60,
    price: 150,
    featured: true,
    highlights: [
      "Gentle full-body relaxation",
      "Stress and tension relief",
      "Soothing touch and calming ambiance",
      "Enhanced sense of comfort and connection",
    ],
  },
  {
    id: "luxe-touch",
    name: "Luxe Touch Massage",
    description:
      "A refined massage experience combining flowing techniques with focused attention and a warm, inviting atmosphere.",
    durationMin: 60,
    price: 200,
    highlights: [
      "Relaxing full-body massage",
      "Focused muscle tension release",
      "Sensory relaxation",
      "Playful, flirtatious atmosphere",
    ],
  },
  {
    id: "signature-full-body",
    name: "Signature Full-Body Massage",
    description:
      "A comprehensive massage designed to provide balanced attention throughout the body while creating a luxurious, intimate experience.",
    durationMin: 60,
    price: 250,
    highlights: [
      "Full-body relaxation",
      "Targeted tension relief",
      "Personalized massage pressure",
      "Heightened sensory relaxation and chemistry",
    ],
  },
  {
    id: "private-luxe-retreat",
    name: "Private Luxe Retreat",
    description:
      "An elevated private massage experience with customized attention, tranquil surroundings, and an indulgent atmosphere.",
    durationMin: 60,
    price: 300,
    highlights: [
      "Personalized bodywork",
      "Deep relaxation",
      "Romantic and sensual ambiance",
      "Increased comfort, confidence, and connection",
    ],
  },
  {
    id: "premium-sensation",
    name: "Premium Sensation Massage",
    description:
      "Our premium massage experience combining tailored bodywork, luxurious surroundings, and attentive personal service.",
    durationMin: 60,
    price: 400,
    highlights: [
      "Bespoke massage techniques",
      "Total-body relaxation",
      "Enhanced sensory experience",
      "Flirty, intimate atmosphere",
    ],
  },
  {
    id: "executive-private",
    name: "Executive Private Massage",
    description:
      "Our signature private experience, offering highly personalized massage, extended relaxation, and an exclusive atmosphere tailored to the individual.",
    durationMin: 120,
    price: 750,
    highlights: [
      "Bespoke massage experience",
      "Extended relaxation and recovery",
      "Personalized attention throughout",
      "Elevated intimacy, chemistry, and sensory relaxation",
    ],
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getHoursForDayName(dayName: string): DayHours | undefined {
  return hours.find((h) => h.day === dayName);
}
