import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { services } from "@/lib/spa-config";
import { useBookingStore } from "@/lib/booking-store";
import { cn, formatDuration, formatPrice } from "@/lib/utils";

export function StepServices() {
  const selectedIds = useBookingStore((s) => s.selectedIds);
  const selectService = useBookingStore((s) => s.selectService);
  const selected = selectedIds[0];

  return (
    <div>
      <h1 className="font-serif text-3xl font-medium text-plum-deep">
        Select your massage
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Choose one service to continue. You can review everything before payment.
      </p>
      <div className="mt-6 flex flex-col gap-3">
        {services.map((service) => {
          const isSelected = selected === service.id;
          return (
            <article
              key={service.id}
              className={cn(
                "soft-card p-4 transition-[box-shadow] duration-150",
                isSelected && "shadow-[0_0_0_1.5px_var(--color-champagne),var(--shadow-border-hover)]",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-semibold text-plum-deep">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {service.id === "executive-private"
                      ? "Extended"
                      : formatDuration(service.durationMin)}{" "}
                    — {formatPrice(service.price)}
                  </p>
                </div>
                {service.featured ? (
                  <span className="shrink-0 rounded-full bg-champagne/15 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-[0.12em] text-champagne uppercase">
                    Signature
                  </span>
                ) : null}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <Button
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className="mt-4"
                onClick={() => selectService(service.id)}
              >
                {isSelected ? (
                  <>
                    <Check className="size-3.5" />
                    Selected
                  </>
                ) : (
                  "Select this service"
                )}
              </Button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
