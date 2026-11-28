import React from "react"
import { Link, useLocation } from "react-router-dom"
import { Youtube, Instagram, Facebook, ArrowUpRight } from "lucide-react"

const SOCIALS = [
  {
    label: "YouTube",
    href: "https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa",
    Icon: Youtube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/telly_shinee_official?jplx=MTJwaThvMWc2NnkyOA==",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1F944M7d5r/",
    Icon: Facebook,
  },
]

const Footer = () => {
  const location = useLocation()
  if (location.pathname.startsWith("/admin") && location.pathname !== "/admin/login") {
    return null
  }

  return (
    <footer className="bg-charcoal text-ivory border-t border-soft-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-soft-black">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-black tracking-tight text-ivory">
                Telly <span className="text-burgundy italic font-bold">Shine</span>
              </span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-gold mt-1">
                Entertainment Publication
              </span>
            </Link>
            <p className="text-ivory/65 text-sm mt-4 leading-relaxed max-w-md">
              An independent entertainment &amp; culture publication covering Bollywood,
              Hollywood, Television, Digital OTT, Cinema, and exclusive celebrity stories.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex items-center justify-center w-9 h-9 rounded-sm border border-soft-black bg-soft-black/60 text-ivory/80 hover:border-gold hover:text-gold transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Sections Column */}
          <div className="md:col-span-4">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Sections
            </h2>
            <ul className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-ivory/75 text-sm">
              <li>
                <Link to="/category/bollywood" className="hover:text-ivory transition-colors">
                  Bollywood
                </Link>
              </li>
              <li>
                <Link to="/category/hollywood" className="hover:text-ivory transition-colors">
                  Hollywood
                </Link>
              </li>
              <li>
                <Link to="/category/television" className="hover:text-ivory transition-colors">
                  TV &amp; Television
                </Link>
              </li>
              <li>
                <Link to="/category/digital" className="hover:text-ivory transition-colors">
                  Digital &amp; OTT
                </Link>
              </li>
              <li>
                <Link to="/category/movies" className="hover:text-ivory transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link to="/category/celebrity" className="hover:text-ivory transition-colors">
                  Celebrity News
                </Link>
              </li>
              <li>
                <Link to="/category/stories" className="hover:text-ivory transition-colors">
                  Stories
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-ivory transition-colors">
                  Latest News
                </Link>
              </li>
            </ul>
          </div>

          {/* Publication Column */}
          <div className="md:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold mb-4">
              Publication
            </h2>
            <ul className="space-y-2.5 text-ivory/75 text-sm">
              <li>
                <Link to="/about" className="hover:text-ivory transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-ivory transition-colors">
                  Editorial Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-ivory transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-ivory transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-gold hover:text-ivory transition-colors"
                >
                  Editorial Portal <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-ivory/45 text-xs">
          <span>
            &copy; {new Date().getFullYear()} Telly Shine Entertainment. All rights reserved.
          </span>
          <span className="tracking-wider uppercase text-[10px]">
            Cinema &bull; Television &bull; Culture
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
