/**
 * Velvet Moon Wellness — editable content.
 * Update services, prices, hours, and contact here.
 */

export const spa = {
  name: "Velvet Moon Wellness",
  wordmark: "Velvet Moon",
  tagline: "Relax. Unwind. Feel renewed.",
  subtitle: "Massage & Wellness",
  heroHeadline: "Private Massage in a Calm, Unhurried Setting",
  heroSubtext:
    "Select your preferred massage, choose a time, and secure your booking with a simple 50% deposit.",
  trustBar:
    "Private sessions · 50% deposit holds your time · 24-hour flexible rescheduling · Fully discreet",
  timezoneLabel: "Eastern Time",
  depositPercent: 50,
  bookingLeadHours: 2,
  bookingWindowDays: 60,
  slotIntervalMin: 30,
  maxDurationHours: 2,
  logoSrc: "/logo.webp" as string | null,
  logoMarkSrc: "/logo-mark.webp" as string | null,
  bannerSrc: "/banner-hero.webp" as string | null,
} as const;

export const about = {
  headline: "A quieter kind of luxury",
  body: [
    "Velvet Moon Wellness is a sanctuary for unhurried care. Our therapists blend classical technique with a quietly luxurious touch — warm rooms, considered products, and treatments paced to your body rather than the clock.",
    "Every session is designed to feel private, professional, and deeply restorative. Book in advance, arrive as you are, and leave lighter.",
  ],
};

export const howItWorks = [
  {
    title: "Choose your massage",
    body: "Select the experience that suits you — from our Signature relaxation to longer private sessions.",
  },
  {
    title: "Pick a time",
    body: "Choose a date and time that works for you. We’ll hold it once your deposit is received.",
  },
  {
    title: "Secure your booking",
    body: "Pay a simple 50% deposit online. The remaining balance is due at the start of your appointment.",
  },
];

export const faq = [
  {
    question: "Is the session completely private?",
    answer:
      "Yes. Every appointment is private and discreet. You will not be interrupted.",
  },
  {
    question: "How does the deposit work?",
    answer:
      "A 50% deposit is required to hold your preferred time. It is applied in full toward your treatment. The remaining balance is paid at the start of your appointment.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Please give at least 24 hours’ notice to cancel or reschedule. With 24 or more hours’ notice, we can move your deposit to a new date (or refund it when practical). Cancellations with less than 24 hours’ notice or missed appointments are generally non-refundable. Genuine emergencies are considered case by case.",
  },
  {
    question: "What should I expect?",
    answer:
      "Arrive about 10 minutes early so we can settle you in. Sessions are calm, professional, and paced to your body rather than the clock. Please let us know in advance about any injuries, allergies, or conditions we should be aware of.",
  },
];

export const contact = {
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

/** Full booking policy & disclaimer shown on /policies and summarized at checkout. */
export const policies = [
  {
    title: "Wellness & relaxation services",
    body: "Our sessions are offered for relaxation, personal wellness, and stress relief. Services are provided in a professional, respectful environment.",
  },
  {
    title: "Deposit & confirmation",
    body: "A 50% deposit holds your preferred time and is applied in full toward your treatment. Your booking is confirmed after payment is verified. The remaining balance is due at the start of your appointment.",
  },
  {
    title: "Cancellation & rescheduling",
    body: "Please give at least 24 hours' notice to cancel or reschedule. With 24 or more hours' notice, we're happy to move your deposit to a new date (or refund it when that's practical). Cancellations with less than 24 hours' notice, or missed appointments, generally mean the deposit is non-refundable. We'll always try to rebook you when we can. Genuine emergencies are considered case by case—please message us as soon as you can.",
  },
  {
    title: "Arrival & late policy",
    body: "Please aim to arrive about 10 minutes early so we can settle you in. If you're running late, a quick message helps. Late arrivals may mean a slightly shorter session so the next guest isn't delayed.",
  },
  {
    title: "Health & safety",
    body: "Please share anything we should know when you book (or before we begin)—injuries, allergies, pregnancy, or medical conditions. We may adapt a treatment, or in rare cases decline one, when it wouldn't be safe or appropriate.",
  },
  {
    title: "Conduct & environment",
    body: "We're here for a calm, professional experience. If conduct is inappropriate or outside the scope of wellness services, we may end the session and decline future bookings.",
  },
  {
    title: "Privacy",
    body: "Your contact and booking details are used only to manage your appointment and related communication. We handle client information discreetly.",
  },
  {
    title: "Payment proof",
    body: "For bank transfer or mobile payment, please use the details provided and upload a clear payment screenshot when asked so we can verify and confirm your booking.",
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
    description:
      "Our most popular choice. A personalized relaxation massage focused on melting tension and leaving you deeply restored. Ideal for first-time guests.",
    durationMin: 60,
    price: 100,
    featured: true,
  },
  {
    id: "luxe-touch",
    name: "Luxe Touch Massage",
    description:
      "Premium full-body relaxation with customized pressure and extra attention to the areas that need it most.",
    durationMin: 60,
    price: 150,
  },
  {
    id: "signature-full-body",
    name: "Signature Full-Body Massage",
    description:
      "A comprehensive full-body experience designed for deeper release and lasting calm.",
    durationMin: 60,
    price: 250,
  },
  {
    id: "private-luxe-retreat",
    name: "Private Luxe Retreat",
    description:
      "An elevated private session with refined technique and a more luxurious pace.",
    durationMin: 60,
    price: 400,
  },
  {
    id: "premium-sensation",
    name: "Premium Sensation Massage",
    description:
      "Highly customized massage focused on refined sensation and complete mental + physical reset.",
    durationMin: 60,
    price: 500,
  },
  {
    id: "executive-private",
    name: "Executive Private Massage",
    description:
      "Extended, highly personalized private massage for those who want the fullest experience.",
    durationMin: 120,
    price: 750,
  },
];

export function getService(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export function getHoursForDayName(dayName: string): DayHours | undefined {
  return hours.find((h) => h.day === dayName);
}
