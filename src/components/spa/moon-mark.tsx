import { cn } from "@/lib/utils";

/** Premium crescent mark — charcoal + champagne gold */
export function MoonMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-mark.svg"
      alt=""
      width={32}
      height={32}
      className={cn("size-8 shrink-0", className)}
      aria-hidden="true"
    />
  );
}

/** Full wordmark logo for hero / header lockups */
export function BrandLogo({
  className,
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
  if (variant === "mark") {
    return (
      <img
        src="/logo-mark.svg"
        alt="Velvetmoon Spa"
        className={cn("h-10 w-10", className)}
      />
    );
  }
  return (
    <img
      src="/logo.svg"
      alt="Velvetmoon Spa"
      className={cn("h-10 w-auto max-w-[220px]", className)}
    />
  );
}
