import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useBookingStore,
  type PreferredContact,
} from "@/lib/booking-store";
import { cn } from "@/lib/utils";

export function StepDetails() {
  const client = useBookingStore((s) => s.client);
  const locationType = useBookingStore((s) => s.locationType);
  const patchClient = useBookingStore((s) => s.patchClient);
  const addressRequired = locationType === "outcall";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold text-plum-deep">
          Your details
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          We only collect what we need to manage your appointment.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="client-name">First name</Label>
          <Input
            id="client-name"
            autoComplete="given-name"
            placeholder="Avery"
            value={client.name}
            onChange={(e) => patchClient({ name: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-phone">Phone / WhatsApp</Label>
          <Input
            id="client-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+1 (440) 544-5757"
            value={client.phone}
            onChange={(e) => patchClient({ phone: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-email">Email</Label>
          <Input
            id="client-email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={client.email}
            onChange={(e) => patchClient({ email: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-address">
            Full address{addressRequired ? "" : " (optional)"}
          </Label>
          <Textarea
            id="client-address"
            autoComplete="street-address"
            placeholder={
              addressRequired
                ? "Street, city, state, ZIP — required for outcall"
                : "Optional for incall; shared only if needed"
            }
            value={client.address}
            onChange={(e) => patchClient({ address: e.target.value })}
          />
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-foreground/80">
            Preferred contact method
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "whatsapp" as PreferredContact, label: "WhatsApp" },
                { id: "phone" as PreferredContact, label: "Phone" },
                { id: "email" as PreferredContact, label: "Email" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => patchClient({ preferredContact: opt.id })}
                className={cn(
                  "h-11 rounded-full text-sm font-medium transition-[box-shadow]",
                  client.preferredContact === opt.id
                    ? "bg-plum text-primary-foreground"
                    : "bg-card text-foreground shadow-[0_0_0_1px_var(--color-border)]",
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="client-notes">Special requests or preferences</Label>
          <Textarea
            id="client-notes"
            placeholder="Pressure preference, areas to focus on, allergies…"
            value={client.notes}
            onChange={(e) => patchClient({ notes: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">Optional</p>
        </div>
      </div>

      <p className="rounded-xl bg-cream-deep/70 px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
        Your information is kept private and is used only to manage your
        appointment.
      </p>
    </div>
  );
}

export function detailsReady(
  name: string,
  phone: string,
  email: string,
  address: string,
  locationType: "incall" | "outcall" | null,
): boolean {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  if (!(name.trim().length > 1 && phone.trim().length >= 8 && emailOk)) return false;
  if (locationType === "outcall" && address.trim().length < 8) return false;
  return true;
}
