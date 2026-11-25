import React from "react"
import { Link, useLocation } from "react-router-dom"
import { FaYoutube, FaInstagram, FaFacebook } from "react-icons/fa"

const socials = [
  {
    label: "YouTube",
    href: "https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa",
    Icon: FaYoutube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/telly_shinee_official?jplx=MTJwaThvMWc2NnkyOA==",
    Icon: FaInstagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1F944M7d5r/",
    Icon: FaFacebook,
  },
]

const Footer = () => {
  const location = useLocation()
  if (location.pathname.startsWith("/admin") && location.pathname !== "/admin/login") {
    return null
  }

  return (
    <footer className="bg-slate-950 text-white py-12 mt-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <Link to="/" className="text-xl font-black tracking-tight">
            <span className="text-red-500">Telly Shine</span> Entertainment
          </Link>
          <p className="text-slate-400 text-sm mt-3 leading-6 max-w-md">
            Your premier destination for entertainment news, television updates,
            digital/OTT stories, movie reviews, and exclusive podcasts.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
            Categories
          </h2>
          <ul className="grid grid-cols-2 gap-2 text-slate-400 text-sm">
            <li><Link to="/category/blog" className="hover:text-white">Blog</Link></li>
            <li><Link to="/category/television" className="hover:text-white">Television</Link></li>
            <li><Link to="/category/digital" className="hover:text-white">Digital</Link></li>
            <li><Link to="/category/movies" className="hover:text-white">Movies</Link></li>
            <li><Link to="/category/stories" className="hover:text-white">Stories</Link></li>
            <li><Link to="/category/podcasts" className="hover:text-white">Podcasts</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
            Follow Us
          </h2>
          <div className="flex gap-5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="text-slate-300 hover:text-red-500 transition-colors"
              >
                <Icon size={24} />
              </a>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-4">
            Follow Telly Shine Entertainment on our official social channels.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-500 text-xs">
        <span>&copy; {new Date().getFullYear()} Telly Shine Entertainment. All rights reserved.</span>
        <Link to="/admin/login" className="hover:text-slate-300">
          Editorial Portal
        </Link>
      </div>
    </footer>
  )
}

export default Footer
