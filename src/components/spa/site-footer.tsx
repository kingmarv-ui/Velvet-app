import { Link } from "@tanstack/react-router";
import { MoonMark } from "@/components/spa/moon-mark";
import { spa, contact } from "@/lib/spa-config";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/8">
      <div className="narrow px-5 py-10">
        <div className="flex items-center gap-3">
          <MoonMark className="size-9" />
          <div>
            <p className="font-serif text-xl text-plum-deep">{spa.name}</p>
            <p className="text-sm text-muted-foreground">{spa.tagline}</p>
          </div>
        </div>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/" className="text-foreground/60 transition-colors hover:text-champagne">
            Home
          </Link>
          <a href="/#services" className="text-foreground/60 transition-colors hover:text-champagne">
            Massage Services
          </a>
          <a href="/#about" className="text-foreground/60 transition-colors hover:text-champagne">
            About
          </a>
          <Link to="/book" className="text-foreground/60 transition-colors hover:text-champagne">
            Booking
          </Link>
          <a href="/#contact" className="text-foreground/60 transition-colors hover:text-champagne">
            Contact
          </a>
          <a href={contact.email.href} className="text-foreground/60 transition-colors hover:text-champagne">
            Email
          </a>
        </nav>
        <p className="mt-8 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {spa.name}. All treatments are professional
          wellness services.
        </p>
      </div>
    </footer>
  );
}
