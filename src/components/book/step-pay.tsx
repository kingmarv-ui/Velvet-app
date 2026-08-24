import type { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { Check, Copy, CreditCard, Landmark, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const card = useBookingStore((s) => s.card);
  const transferAcknowledged = useBookingStore((s) => s.transferAcknowledged);
  const policyAccepted = useBookingStore((s) => s.policyAccepted);
  const setPaymentMethod = useBookingStore((s) => s.setPaymentMethod);
  const setDepositOnly = useBookingStore((s) => s.setDepositOnly);
  const patchCard = useBookingStore((s) => s.patchCard);
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
    const text = encodeURIComponent(
      `Hi Velvetmoon — I'd like to pay my booking deposit/balance via Zelle, Cash App, Venmo, or PayPal.\n\nService: ${services.map((s) => s.name).join(", ")}\nDate: ${when}\nAmount due now: ${formatPrice(dueNow)}\nName: ${client.name || "Guest"}`,
    );
    return `https://wa.me/14405445757?text=${text}`;
  })();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-plum-deep">
          Review & pay
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A {spa.depositPercent}% deposit holds your time. Card checkout is demo
          only — no real charges yet.
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
                {formatPrice(s.price)}
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
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <PayChoice
            selected={paymentMethod === "card"}
            title="Card"
            subtitle="Demo only — no charge"
            icon={<CreditCard className="size-4" />}
            onClick={() => setPaymentMethod("card")}
          />
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

      {paymentMethod === "card" ? (
        <section className="space-y-3">
          <p className="rounded-xl bg-cream-deep/70 px-3 py-2 text-xs text-muted-foreground">
            Demo checkout — enter any 16-digit number. Nothing will be charged.
            Live card payments will be added later.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="card-holder">Name on card</Label>
            <Input
              id="card-holder"
              autoComplete="cc-name"
              placeholder="Avery Moon"
              value={card.holder}
              onChange={(e) => patchCard({ holder: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="card-number">Card number</Label>
            <Input
              id="card-number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="4242 4242 4242 4242"
              value={card.number}
              onChange={(e) => patchCard({ number: formatCardNumber(e.target.value) })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="card-exp">Expiry</Label>
              <Input
                id="card-exp"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM / YY"
                value={card.expiry}
                onChange={(e) => patchCard({ expiry: formatExpiry(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="card-cvc">CVC</Label>
              <Input
                id="card-cvc"
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="123"
                value={card.cvc}
                onChange={(e) =>
                  patchCard({ cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })
                }
              />
            </div>
          </div>
        </section>
      ) : null}

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
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-plum"
              checked={transferAcknowledged}
              onChange={(e) => setTransferAcknowledged(e.target.checked)}
            />
            I have noted the transfer details and will send the deposit.
          </label>
        </section>
      ) : null}

      {paymentMethod === "mobile" ? (
        <section className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Pay via Zelle, Cash App, Venmo, or PayPal. Message us on WhatsApp
            and we will send the payment details for the amount due now.
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
            After you arrange payment, return here and secure your appointment.
            We confirm once the deposit is received.
          </p>
          <label className="flex min-h-11 items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-plum"
              checked={transferAcknowledged}
              onChange={(e) => setTransferAcknowledged(e.target.checked)}
            />
            I will complete mobile payment via WhatsApp.
          </label>
        </section>
      ) : null}

      <section className="space-y-3 rounded-2xl border border-plum/10 bg-cream-deep/40 p-4">
        <p className="section-label">Privacy & booking policy</p>
        <ul className="space-y-2 text-xs leading-relaxed text-muted-foreground">
          <li>
            <span className="font-medium text-foreground/80">Privacy:</span>{" "}
            Client information is handled discreetly and used only for
            appointment management.
          </li>
          <li>
            <span className="font-medium text-foreground/80">Booking:</span>{" "}
            Appointments are confirmed only after the required payment or
            deposit has been successfully received.
          </li>
          <li>
            <span className="font-medium text-foreground/80">Cancellation:</span>{" "}
            At least 24 hours' notice is required to cancel or reschedule
            without forfeiting the deposit.
          </li>
        </ul>
        <label className="flex min-h-11 items-start gap-3 text-sm">
          <input
            type="checkbox"
            className="mt-1 size-4 accent-plum"
            checked={policyAccepted}
            onChange={(e) => setPolicyAccepted(e.target.checked)}
          />
          I have read and accept the privacy and booking policies.
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
          ? "bg-card shadow-[0_0_0_1.5px_var(--color-plum)]"
          : "bg-card shadow-[var(--shadow-border)]",
      )}
    >
      <span className="flex items-center gap-1.5 text-sm font-medium text-plum-deep">
        {icon}
        {title}
        {selected ? <Check className="size-3.5 text-plum" /> : null}
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
        className="inline-flex size-10 items-center justify-center rounded-full text-plum hover:bg-cream-deep"
        aria-label={`Copy ${label}`}
      >
        <Copy className="size-4" />
      </button>
    </div>
  );
}

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function paymentReady(
  method: "card" | "transfer" | "mobile",
  card: { holder: string; number: string; expiry: string; cvc: string },
  transferAcknowledged: boolean,
): boolean {
  if (method === "transfer" || method === "mobile") return transferAcknowledged;
  const number = card.number.replace(/\s/g, "");
  const expiry = card.expiry.replace(/\s/g, "");
  return (
    card.holder.trim().length > 1 &&
    number.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    card.cvc.length >= 3
  );
}
