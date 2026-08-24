import type { ReactNode } from "react";
import { format, parseISO } from "date-fns";
import { Check, Copy, CreditCard, Landmark } from "lucide-react";
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
  const client = useBookingStore((s) => s.client);
  const paymentMethod = useBookingStore((s) => s.paymentMethod);
  const depositOnly = useBookingStore((s) => s.depositOnly);
  const card = useBookingStore((s) => s.card);
  const transferAcknowledged = useBookingStore((s) => s.transferAcknowledged);
  const setPaymentMethod = useBookingStore((s) => s.setPaymentMethod);
  const setDepositOnly = useBookingStore((s) => s.setDepositOnly);
  const patchCard = useBookingStore((s) => s.patchCard);
  const setTransferAcknowledged = useBookingStore((s) => s.setTransferAcknowledged);

  const { services, duration, total, deposit, dueNow, remainder } = bookingTotals(
    selectedIds,
    depositOnly,
  );

  const when =
    date && time
      ? `${format(parseISO(date), "EEEE, d MMMM yyyy")} · ${formatTimeDisplay(time)}`
      : "Not scheduled";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-plum-deep">
          Review & pay
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          A {spa.depositPercent}% deposit holds your time. This preview does not
          charge a real card.
        </p>
      </div>

      <section className="soft-card p-4">
        <p className="section-label">Your appointment</p>
        <p className="mt-2 font-serif text-xl text-plum-deep">{when}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDuration(duration)} · {client.name || "Guest"}
        </p>
        <ul className="mt-4 divide-y divide-plum/8">
          {services.map((s) => (
            <li key={s.id} className="flex items-start justify-between gap-3 py-2.5">
              <div>
                <p className="text-sm font-medium leading-snug">{s.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDuration(s.durationMin)}
                </p>
              </div>
              <p className="text-sm tabular-nums">{formatPrice(s.price)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex justify-between pt-2 text-sm">
          <span className="text-muted-foreground">Total</span>
          <span className="font-medium tabular-nums">{formatPrice(total)}</span>
        </div>
      </section>

      <section>
        <p className="section-label">Amount due now</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <PayChoice
            selected={depositOnly}
            title={`${spa.depositPercent}% deposit`}
            subtitle={formatPrice(deposit)}
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
            selected={paymentMethod === "card"}
            title="Card"
            subtitle="Visa, Mastercard"
            icon={<CreditCard className="size-4" />}
            onClick={() => setPaymentMethod("card")}
          />
          <PayChoice
            selected={paymentMethod === "transfer"}
            title="Bank transfer"
            subtitle="Advance payment"
            icon={<Landmark className="size-4" />}
            onClick={() => setPaymentMethod("transfer")}
          />
        </div>
      </section>

      {paymentMethod === "card" ? (
        <section className="space-y-3">
          <p className="rounded-xl bg-cream-deep/70 px-3 py-2 text-xs text-muted-foreground">
            Demo checkout — enter any 16-digit number. Nothing will be charged.
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
      ) : (
        <section className="soft-card space-y-3 p-4">
          <p className="text-sm text-muted-foreground">
            Transfer {formatPrice(dueNow)} and use your booking reference in the
            description. We’ll confirm as soon as it lands.
          </p>
          <BankRow label="Bank" value={bankTransfer.bank} />
          <BankRow label="Account name" value={bankTransfer.accountName} />
          <BankRow label="Account number" value={bankTransfer.accountNumber} />
          <BankRow label="Routing" value={bankTransfer.routing} />
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
      )}

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
  method: "card" | "transfer",
  card: { holder: string; number: string; expiry: string; cvc: string },
  transferAcknowledged: boolean,
): boolean {
  if (method === "transfer") return transferAcknowledged;
  const number = card.number.replace(/\s/g, "");
  const expiry = card.expiry.replace(/\s/g, "");
  return (
    card.holder.trim().length > 1 &&
    number.length === 16 &&
    /^\d{2}\/\d{2}$/.test(expiry) &&
    card.cvc.length >= 3
  );
}
