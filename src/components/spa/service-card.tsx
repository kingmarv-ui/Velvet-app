import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatDuration, formatPriceRange } from "@/lib/utils";
import type { Service } from "@/lib/spa-config";

export function ServiceCard({
  service,
  selected,
  onSelect,
}: {
  service: Service;
  selected: boolean;
  onSelect: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const long = service.description.length > 118;

  return (
    <article
      className={cn(
        "soft-card p-4 transition-[box-shadow,transform] duration-200",
        selected && "shadow-[0_0_0_1.5px_var(--color-plum),var(--shadow-border)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold leading-snug text-plum-deep">
          {service.name}
        </h3>
        {service.featured ? (
          <span className="mt-1 shrink-0 rounded-full bg-champagne-light/70 px-2 py-0.5 text-[0.65rem] font-medium tracking-wide text-plum uppercase">
            Signature
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-2 text-sm leading-relaxed text-muted-foreground",
          long && !expanded && "line-clamp-2",
        )}
      >
        {service.description}
      </p>
      {long ? (
        <button
          type="button"
          className="mt-1 min-h-8 text-sm font-medium text-plum"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm tabular-nums text-foreground">
          <span className="font-medium">{formatDuration(service.durationMin)}</span>
          <span className="mx-2 text-border">|</span>
          <span className="font-medium">
            {formatPriceRange(service.price, service.priceTo)}
          </span>
        </p>
        <Button
          type="button"
          variant={selected ? "default" : "outline"}
          size="sm"
          onClick={onSelect}
          aria-pressed={selected}
          className="min-w-[5.5rem]"
        >
          {selected ? (
            <>
              <Check className="size-3.5" />
              Selected
            </>
          ) : (
            "Select"
          )}
        </Button>
      </div>
    </article>
  );
}
