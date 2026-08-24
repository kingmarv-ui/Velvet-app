import { Link } from "@tanstack/react-router";
import { spa, contact } from "@/lib/spa-config";

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-plum/8">
      <div className="narrow px-5 py-10">
        <p className="font-serif text-xl text-plum-deep">{spa.name}</p>
        <p className="mt-1 text-sm text-muted-foreground">{spa.tagline}</p>
        <nav className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link to="/" className="text-plum hover:underline">
            Home
          </Link>
          <Link to="/book" className="text-plum hover:underline">
            Book
          </Link>
          <a href={contact.instagram.url} className="text-plum hover:underline">
            Instagram
          </a>
          <a href={contact.email.href} className="text-plum hover:underline">
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
