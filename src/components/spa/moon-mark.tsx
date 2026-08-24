import { cn } from "@/lib/utils";

export function MoonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="9" fill="currentColor" className="text-plum" />
      <path
        fill="currentColor"
        className="text-champagne-light"
        d="M20.2 6.8c-5.4 0-9.8 4.4-9.8 9.8s4.4 9.8 9.8 9.8c.7 0 1.4-.07 2.05-.2A8.6 8.6 0 0 1 11.6 16.6 8.6 8.6 0 0 1 22.25 7c-.66-.13-1.35-.2-2.05-.2z"
      />
    </svg>
  );
}
