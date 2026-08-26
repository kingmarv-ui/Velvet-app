import { createFileRoute, Link } from "@tanstack/react-router";
import { MoonMark } from "@/components/spa/moon-mark";
import { SiteFooter } from "@/components/spa/site-footer";
import { Button } from "@/components/ui/button";
import { policies, spa } from "@/lib/spa-config";

export const Route = createFileRoute("/policies")({
  component: PoliciesPage,
  head: () => ({
    meta: [
      { title: `Booking Policies — ${spa.name}` },
      {
        name: "description",
        content:
          "Booking, deposit, and cancellation policies for Velvet Moon Wellness.",
      },
    ],
  }),
});

function PoliciesPage() {
  return (
    <div className="page-shell min-h-screen">
      <header className="border-b border-white/8">
        <div className="narrow flex h-14 items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2">
            <MoonMark className="size-7" />
            <span className="font-serif text-base font-semibold text-plum-deep">
              {spa.name}
            </span>
          </Link>
          <Button asChild size="sm">
            <Link to="/book">Book now</Link>
          </Button>
        </div>
      </header>

      <main className="narrow space-y-8 px-5 py-10">
        <div>
          <p className="section-label">Policies</p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-plum-deep">
            Booking policy & disclaimer
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            By completing a booking, you confirm that you have read, understood,
            and agree to the following.
          </p>
        </div>

        <div className="space-y-6">
          {policies.map((p, i) => (
            <article key={p.title} className="soft-card p-5">
              <h2 className="font-serif text-lg text-plum-deep">
                <span className="mr-2 text-sm tabular-nums text-muted-foreground">
                  {i + 1}.
                </span>
                {p.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.body}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/book">Book an appointment</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
