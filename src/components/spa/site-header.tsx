import { Link } from "@tanstack/react-router";
import { MoonMark } from "@/components/spa/moon-mark";
import { Button } from "@/components/ui/button";
import { spa } from "@/lib/spa-config";
import { cn } from "@/lib/utils";

export function SiteHeader({
  showCta = true,
  backTo,
}: {
  showCta?: boolean;
  backTo?: { to: "/"; label?: string };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-plum/8 bg-cream/85 backdrop-blur-md">
      <div className="narrow flex h-14 items-center justify-between gap-3 px-5">
        {backTo ? (
          <Link
            to={backTo.to}
            className="inline-flex min-h-11 items-center text-sm font-medium text-plum"
          >
            {backTo.label ?? "Back"}
          </Link>
        ) : (
          <Link to="/" className="flex min-h-11 items-center gap-2.5">
            <MoonMark className="size-8" />
            <span className="font-serif text-lg font-semibold tracking-tight text-plum-deep">
              {spa.name}
            </span>
          </Link>
        )}
        {showCta ? (
          <Button asChild size="sm" className={cn(backTo && "ml-auto")}>
            <Link to="/book">Book now</Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
