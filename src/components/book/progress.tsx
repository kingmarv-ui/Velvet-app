import { cn } from "@/lib/utils";

const STEPS = [
  { n: 1, label: "Services" },
  { n: 2, label: "Schedule" },
  { n: 3, label: "Confirm" },
] as const;

export function BookingProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="px-1">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Step {step} of 3
      </p>
      <ol className="mt-3 flex items-center">
        {STEPS.map((item, i) => {
          const done = step > item.n;
          const current = step === item.n;
          return (
            <li key={item.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full text-xs font-medium tabular-nums transition-colors duration-200",
                    done && "bg-champagne text-accent-foreground",
                    current && "bg-plum text-primary-foreground",
                    !done && !current && "bg-cream-deep text-muted-foreground",
                  )}
                >
                  {item.n}
                </span>
                <span
                  className={cn(
                    "text-[0.7rem] font-medium",
                    current ? "text-plum-deep" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </span>
              </div>
              {i < STEPS.length - 1 ? (
                <div
                  className={cn(
                    "relative top-[-0.7rem] mx-1.5 h-px flex-1",
                    step > item.n ? "bg-champagne" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
