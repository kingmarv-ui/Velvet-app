/**
 * Velvet Moon Wellness — editable content.
 * Update services, prices, hours, and contact here.
 */

export const spa = {
  name: "Velvet Moon Wellness",
  wordmark: "Velvet Moon",
  tagline: "Relax. Unwind. Feel renewed.",
  subtitle: "Massage & Wellness",
  heroHeadline: "Private Massage in Texas",
  heroSubtext:
    "Serving Texas and surrounding areas within about two hours. Select your massage, choose a time, and hold it with a simple 50% deposit.",
  trustBar:
    "Texas & nearby · Private sessions · 50% deposit holds your time · 24-hour flexible rescheduling",
  firstTimeNote:
    "New here? The Signature is a gentle, popular place to start — fully private and paced to you.",
  serviceAreaLine:
    "We serve Texas and surrounding areas within about a two-hour radius. Incall and outcall are available — tell us where you are when you book.",
  serviceArea: ["Texas", "Oklahoma", "Arkansas", "Louisiana", "New Mexico"],
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
    "Velvet Moon Wellness is a private massage practice serving Texas and surrounding areas within about two hours. Our therapists blend classical technique with a quietly luxurious touch — warm rooms, considered products, and treatments paced to your body rather than the clock.",
    "Every session is designed to feel private, professional, and deeply restorative. Book in advance, arrive as you are, and leave lighter. Incall and outcall appointments are available.",
  ],
};

export const howItWorks = [
  {
    title: "Choose your massage",
    body: "Select the experience that suits you — from our Signature relaxation to longer private sessions.",
  },
  {
    title: "Pick a time",
    body: "Choose a date and time that works for you. We’ll hold it once your deposit is received. Times are shown in Eastern Time.",
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
    question: "Where do you serve?",
    answer:
      "We serve Texas and surrounding areas within about a two-hour radius. Incall and outcall are available — tell us where you are when you book.",
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

/** Short client notes — replace with real testimonials when you have them. */
export const testimonials = [
  {
    quote:
      "Exactly what I needed — private, calm, and no rush. I left feeling completely reset.",
    name: "A.M.",
  },
  {
    quote:
      "Professional from booking to the end of the session. The space felt safe and unhurried.",
    name: "J.R.",
  },
  {
    quote:
      "First time booking a private massage online and the whole process was clear and respectful.",
    name: "S.K.",
  },
];

export const contact = {
  phone: {
    display: "+1 (440) 544-5757",
    tel: "+14405445757",
  },
  whatsapp: {
    display: "WhatsApp",
    e164: "14405445757",
    url: "https://wa.me/14405445757?text=Hello%2C%20I%20want%20to%20book%20a%20spa%20appointment",
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
      "A personalized relaxation massage designed to ease tension and create a calm, intimate atmosphere.",
    durationMin: 60,
    price: 120, // was $150 · 20% off
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
    price: 160, // was $200 · 20% off
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
    price: 200, // was $250 · 20% off
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
    price: 240, // was $300 · 20% off
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
      "Our premium massage experience combines tailored bodywork, luxurious surroundings, and attentive personal service.",
    durationMin: 60,
    price: 320, // was $400 · 20% off
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
      "Our signature private experience offers highly personalized massage, extended relaxation, and an exclusive atmosphere tailored to the individual.",
    durationMin: 120,
    price: 600, // was $750 · 20% off
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
