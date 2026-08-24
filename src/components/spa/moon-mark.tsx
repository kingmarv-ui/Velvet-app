import { cn } from "@/lib/utils";
import { LOGO_MARK_SRC, LOGO_SRC } from "@/lib/brand-assets";

/** Official circular brand mark */
export function MoonMark({ className }: { className?: string }) {
  return (
    <img
      src={LOGO_MARK_SRC}
      alt=""
      width={40}
      height={40}
      className={cn(
        "size-9 shrink-0 rounded-full object-cover shadow-[0_0_0_1px_rgba(201,163,106,0.35)]",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Full circular logo for hero and branding lockups */
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
        src={LOGO_MARK_SRC}
        alt="Velvet Moon Wellness"
        width={80}
        height={80}
        className={cn("size-20 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <img
      src={LOGO_SRC}
      alt="Velvet Moon Wellness"
      width={480}
      height={480}
      className={cn(
        "mx-auto h-auto w-full max-w-[280px] rounded-full object-cover shadow-[0_16px_48px_-16px_rgba(0,0,0,0.65)] sm:max-w-[320px]",
        className,
      )}
    />
  );
}
