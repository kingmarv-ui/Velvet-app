import { Link } from "@tanstack/react-router";
import { spa, contact } from "@/lib/spa-config";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-white/8">
      <div className="narrow px-5 py-10">
        <p className="font-serif text-xl text-plum-deep">{spa.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{spa.tagline}</p>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/" className="text-foreground/60 hover:text-champagne transition-colors">
            Home
          </Link>
          <a href="/#services" className="text-foreground/60 hover:text-champagne transition-colors">
            Massage Services
          </a>
          <a href="/#about" className="text-foreground/60 hover:text-champagne transition-colors">
            About
          </a>
          <Link to="/book" className="text-foreground/60 hover:text-champagne transition-colors">
            Booking
          </Link>
          <a href="/#contact" className="text-foreground/60 hover:text-champagne transition-colors">
            Contact
          </a>
          <a href={contact.email.href} className="text-foreground/60 hover:text-champagne transition-colors">
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
