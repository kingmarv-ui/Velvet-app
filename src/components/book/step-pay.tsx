import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { Check, Copy, Landmark, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { bankTransfer, spa } from "@/lib/spa-config";
import { bookingTotals, useBookingStore } from "@/lib/booking-store";
import { cn, formatDuration, formatPrice, formatTimeDisplay } from "@/lib/utils";

function copy(label: string, value: string) {
  void navigator.clipboard.writeText(value);
  toast.success(`${label} copied`);
}

export function StepPay() {
  const selectedIds = useBookingStore((s) => s.selectedIds);
  const date = useBookingStore((s) => s.date);
  const time = useBookingStore((s) => s.time);
  const durationHours = useBookingStore((s) => s.durationHours);
  const locationType = useBookingStore((s) => s.locationType);
  const client = useBookingStore((s) => s.client);
  const paymentMethod = useBookingStore((s) => s.paymentMethod);
  const depositOnly = useBookingStore((s) => s.depositOnly);
  const transferAcknowledged = useBookingStore((s) => s.transferAcknowledged);
  const policyAccepted = useBookingStore((s) => s.policyAccepted);
  const setPaymentMethod = useBookingStore((s) => s.setPaymentMethod);
  const setDepositOnly = useBookingStore((s) => s.setDepositOnly);
  const setTransferAcknowledged = useBookingStore((s) => s.setTransferAcknowledged);
  const setPolicyAccepted = useBookingStore((s) => s.setPolicyAccepted);

  const { services, duration, total, deposit, dueNow, remainder } = bookingTotals(
    selectedIds,
    depositOnly,
    durationHours,
  );

  const when =
    date && time
      ? `${format(parseISO(date), "EEEE, d MMMM yyyy")} · ${formatTimeDisplay(time)}`
      : "Not scheduled";

  const locationLabel =
    locationType === "incall"
      ? "Incall (address after confirmation)"
      : locationType === "outcall"
        ? "Outcall"
        : "—";

  const whatsappPayUrl = (() => {
    const serviceName = services.map((s) => s.name).join(", ") || "—";
    const dateStr = date ? format(parseISO(date), "EEEE, d MMMM yyyy") : "—";
    const timeStr = time ? formatTimeDisplay(time) : "—";
    const text = encodeURIComponent(
      `Hello Velvet Moon Wellness 👋\n\nI just completed my booking online.\n\nService: ${serviceName}\nDate: ${dateStr}\nTime: ${timeStr}\nAmount: ${formatPrice(dueNow)}\n\nI will love to send the payment via Zelle / Cash App / Venmo / PayPal / Apple Giftcard shortly.\n\nPlease confirm once received. Thank you!`,
    );
    return `https://wa.me/14246662911?text=${text}`;
  })();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-medium text-plum-deep">
          Review & pay
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A {spa.depositPercent}% deposit holds your time. After you send
          payment, upload a screenshot so we can confirm your appointment.
        </p>
      </div>

      <section className="soft-card p-4">
        <p className="section-label">Your appointment</p>
        <p className="mt-2 font-serif text-xl text-plum-deep">{when}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDuration(duration)} · {locationLabel} · {client.name || "Guest"}
        </p>
        <ul className="mt-4 divide-y divide-plum/8">
          {services.map((s) => (
            <li
              key={s.id}
              className="flex items-start justify-between gap-3 py-2 first:pt-0 last:pb-0"
            >
              <span className="text-sm text-foreground/90">{s.name}</span>
              <span className="shrink-0 text-sm tabular-nums text-plum-deep">
                {formatPrice("scaledPrice" in s ? (s as { scaledPrice: number }).scaledPrice : s.price)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between border-t border-plum/8 pt-3">
          <span className="text-sm font-medium text-plum-deep">Total</span>
          <span className="font-serif text-lg tabular-nums text-plum-deep">
            {formatPrice(total)}
          </span>
        </div>
      </section>

      <section>
        <p className="section-label">Amount to pay now</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <PayChoice
            selected={depositOnly}
            title="Booking deposit"
            subtitle={`${spa.depositPercent}% · ${formatPrice(deposit)}`}
            onClick={() => setDepositOnly(true)}
          />
          <PayChoice
            selected={!depositOnly}
            title="Pay in full"
            subtitle={formatPrice(total)}
            onClick={() => setDepositOnly(false)}
          />
        </div>
        {remainder > 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Remaining {formatPrice(remainder)} is due at your appointment.
          </p>
        ) : null}
      </section>

      <section>
        <p className="section-label">Payment method</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <PayChoice
            selected={paymentMethod === "transfer"}
            title="Bank transfer"
            subtitle="Lead Bank"
            icon={<Landmark className="size-4" />}
            onClick={() => setPaymentMethod("transfer")}
          />
          <PayChoice
            selected={paymentMethod === "mobile"}
            title="Mobile pay"
            subtitle="Zelle · Cash App · Venmo · PayPal"
            icon={<Smartphone className="size-4" />}
            onClick={() => setPaymentMethod("mobile")}
          />
        </div>
      </section>

      {paymentMethod === "transfer" ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Transfer the amount due now, then check the box below. Use your
            booking reference as the description when available.
          </p>
          <div className="soft-card space-y-3 p-4">
            <BankRow label="Account name" value={bankTransfer.accountName} />
            <BankRow label="Bank" value={bankTransfer.bank} />
            <BankRow label="Account number" value={bankTransfer.accountNumber} />
            <BankRow label="Account type" value={bankTransfer.accountType} />
            <BankRow label="Routing number" value={bankTransfer.routing} />
          </div>
          <p className="text-xs text-muted-foreground">{bankTransfer.note}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            After you click "Secure my appointment", your booking is
            held as pending. Send the transfer, then upload a screenshot of the
            confirmation on the next screen so we can verify and confirm.
          </p>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-plum"
              checked={transferAcknowledged}
              onChange={(e) => setTransferAcknowledged(e.target.checked)}
            />
            I have noted the transfer details and will send the deposit, then
            upload proof.
          </label>
        </section>
      ) : null}

      {paymentMethod === "mobile" ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pay via Zelle, Cash App, Venmo, PayPal, or Apple Gift Card. Message
            us on WhatsApp with the prefilled booking details.
          </p>
          <a
            href={whatsappPayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Smartphone className="size-4" />
            Continue on WhatsApp
          </a>
          <p className="text-xs text-muted-foreground">
            After you arrange payment, return here and secure your appointment,
            then upload a screenshot so we can confirm.
          </p>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-plum"
              checked={transferAcknowledged}
              onChange={(e) => setTransferAcknowledged(e.target.checked)}
            />
            I will complete mobile payment via WhatsApp and upload proof.
          </label>
        </section>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="section-label">Booking policy & disclaimer</p>
          <Link
            to="/policies"
            className="text-xs font-medium text-champagne underline-offset-4 hover:underline"
          >
            Read full policies
          </Link>
        </div>
        <ul className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground/80">Deposit & confirmation:</span>{" "}
            A 50% deposit holds your preferred time and is applied in full toward
            your treatment. Your booking is confirmed after payment is verified.
          </li>
          <li>
            <span className="font-medium text-foreground/80">Cancellation & rescheduling:</span>{" "}
            Please give at least 24 hours' notice to cancel or reschedule. With 24
            or more hours' notice, we're happy to move your deposit to a new date
            (or refund it when that's practical). Cancellations with less than 24
            hours' notice, or missed appointments, generally mean the deposit is
            non-refundable. We'll always try to rebook you when we can. Genuine
            emergencies are considered case by case—please message us as soon as
            you can.
          </li>
          <li>
            <span className="font-medium text-foreground/80">Wellness & relaxation services:</span>{" "}
            Our sessions are offered for relaxation, personal wellness, and stress
            relief. Services are provided in a professional, respectful environment.
          </li>
          <li>
            <span className="font-medium text-foreground/80">Privacy:</span>{" "}
            Client information is handled discreetly and used only for appointment
            management.
          </li>
        </ul>
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-plum"
            checked={policyAccepted}
            onChange={(e) => setPolicyAccepted(e.target.checked)}
          />
          <span>
            I have read and agree to the{" "}
            <Link to="/policies" className="text-champagne underline-offset-2 hover:underline">
              Velvet Moon Wellness booking policies
            </Link>
            .
          </span>
        </label>
      </section>

      <p className="text-center font-serif text-2xl text-plum-deep">
        Due now {formatPrice(dueNow)}
      </p>
    </div>
  );
}

function PayChoice({
  selected,
  title,
  subtitle,
  icon,
  onClick,
}: {
  selected: boolean;
  title: string;
  subtitle: string;
  icon?: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex min-h-[4.5rem] flex-col items-start justify-center rounded-2xl px-3.5 py-3 text-left transition-[box-shadow,background-color] duration-150",
        selected
          ? "bg-card shadow-[0_0_0_1.5px_var(--color-champagne)]"
          : "bg-card shadow-[var(--shadow-border)]",
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-plum-deep">
        {icon}
        {title}
        {selected ? <Check className="size-3.5 text-champagne" /> : null}
      </span>
      <span className="mt-0.5 text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}

function BankRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-[0.7rem] tracking-wide text-muted-foreground uppercase">
          {label}
        </p>
        <p className="text-sm tabular-nums">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => copy(label, value)}
        className="inline-flex size-10 items-center justify-center rounded-full text-champagne hover:bg-white/10"
        aria-label={`Copy ${label}`}
      >
        <Copy className="size-4" />
      </button>
    </div>
  );
}

export function paymentReady(
  method: "transfer" | "mobile",
  transferAcknowledged: boolean,
): boolean {
  return (method === "transfer" || method === "mobile") && transferAcknowledged;
}
