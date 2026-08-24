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
  const hasHighlights = Boolean(service.highlights?.length);
  const long = service.description.length > 118 || hasHighlights;

  return (
    <article
      className={cn(
        "soft-card p-4 transition-[box-shadow,transform] duration-200",
        selected && "shadow-[0_0_0_1.5px_var(--color-champagne),var(--shadow-border-hover)]",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-xl font-semibold leading-snug text-plum-deep">
          {service.name}
        </h3>
        {service.featured ? (
          <span className="mt-1 shrink-0 rounded-full bg-champagne/15 px-2.5 py-0.5 text-[0.65rem] font-medium tracking-[0.12em] text-champagne uppercase">
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
      {expanded && hasHighlights ? (
        <ul className="mt-3 space-y-1.5 text-sm text-foreground/85">
          {service.highlights!.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-champagne" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {long ? (
        <button
          type="button"
          className="mt-1 min-h-8 text-sm font-medium text-plum"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Show less" : "Session highlights"}
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
