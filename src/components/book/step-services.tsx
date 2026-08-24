import { ServiceCard } from "@/components/spa/service-card";
import { services } from "@/lib/spa-config";
import { useBookingStore } from "@/lib/booking-store";

export function StepServices() {
  const selectedIds = useBookingStore((s) => s.selectedIds);
  const toggleService = useBookingStore((s) => s.toggleService);

  return (
    <div>
      <h1 className="font-serif text-3xl font-semibold text-plum-deep">
        Choose your treatment
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Select one or more services. Duration and price will combine in your
        summary.
      </p>
      {selectedIds.length === 0 ? (
        <p className="mt-5 rounded-xl bg-cream-deep/70 px-4 py-3 text-sm text-muted-foreground">
          Nothing selected yet — tap Select on a treatment to add it.
        </p>
      ) : null}
      <div className="mt-5 flex flex-col gap-3">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedIds.includes(service.id)}
            onSelect={() => toggleService(service.id)}
          />
        ))}
      </div>
    </div>
  );
}
