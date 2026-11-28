import React, { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search as SearchIcon,
  Youtube,
  Instagram,
  Facebook,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOutSuccess } from "@/redux/user/userSlice"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import { EDITORIAL_EASE } from "@/components/editorial/MotionPrimitives"

const PRIMARY_NAV = [
  { label: "Home", to: "/" },
  { label: "Latest News", to: "/news" },
  { label: "Bollywood", to: "/category/bollywood" },
  { label: "Hollywood", to: "/category/hollywood" },
  { label: "TV & Television", to: "/category/television" },
  { label: "Digital", to: "/category/digital" },
  { label: "Movies", to: "/category/movies" },
]

const MORE_NAV = [
  { label: "Celebrity News", to: "/category/celebrity" },
  { label: "Celebrity Stories", to: "/category/stories" },
  { label: "Editorial Blog", to: "/category/blog" },
  { label: "Podcasts", to: "/category/podcasts" },
  { label: "About Us", to: "/about" },
  { label: "Contact Desk", to: "/contact" },
]

const ALL_MOBILE_NAV = [...PRIMARY_NAV, ...MORE_NAV]

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleSignout = async () => {
    try {
      await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      })
      if (auth) {
        try {
          await signOut(auth)
        } catch (signOutErr) {
          console.warn("Firebase signout:", signOutErr.message)
        }
      }
      dispatch(signOutSuccess())
      navigate("/")
    } catch (error) {
      console.error("Signout error:", error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams()
    if (searchTerm.trim()) urlParams.set("searchTerm", searchTerm.trim())
    navigate(`/search?${urlParams.toString()}`)
  }

  // Hide public header on admin pages for clean admin workspace
  if (location.pathname.startsWith("/admin") && location.pathname !== "/admin/login") {
    return null
  }

  const todayFormatted = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <>
      {/* Top Editorial Utility Bar */}
      <div className="bg-charcoal text-ivory/80 border-b border-soft-black text-[11px] tracking-wider uppercase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-gold font-medium">{todayFormatted}</span>
            <span className="hidden sm:inline text-ivory/30">|</span>
            <span className="hidden sm:inline text-ivory/60">
              Luxury Entertainment &amp; Culture
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-ivory/70">
              <Link to="/about" className="hover:text-gold transition-colors">
                About
              </Link>
              <Link to="/contact" className="hover:text-gold transition-colors">
                Contact
              </Link>
            </div>
            <span className="hidden sm:inline text-ivory/30">|</span>
            <div className="flex items-center gap-3">
              <a
                href="https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-ivory/75 hover:text-burgundy transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/telly_shinee_official?jplx=MTJwaThvMWc2NnkyOA=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-ivory/75 hover:text-gold transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.facebook.com/share/1F944M7d5r/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-ivory/75 hover:text-gold transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead */}
      <div className="bg-ivory border-b border-stone">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 md:py-5 grid grid-cols-2 md:grid-cols-3 items-center gap-4">
          {/* Left: Search (Desktop) */}
          <form
            onSubmit={handleSubmit}
            className="hidden md:flex items-center border-b border-stone focus-within:border-charcoal transition-colors pb-1.5 max-w-[240px]"
          >
            <SearchIcon className="w-4 h-4 text-ink-muted mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search stories, stars..."
              className="bg-transparent text-xs text-charcoal placeholder:text-ink-muted/70 focus:outline-none w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          {/* Center: Telly Shine Editorial Masthead */}
          <div className="md:text-center justify-self-start md:justify-self-center">
            <Link to="/" className="inline-block group">
              <span className="block font-serif text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-charcoal leading-none">
                Telly <span className="text-burgundy italic font-bold">Shine</span>
              </span>
              <span className="mt-1 flex items-center md:justify-center gap-2 text-[9px] sm:text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-muted">
                <span className="hidden sm:inline-block w-4 h-[1px] bg-gold" />
                Entertainment
                <span className="hidden sm:inline-block w-4 h-[1px] bg-gold" />
              </span>
            </Link>
          </div>

          {/* Right: Auth + Mobile Toggle */}
          <div className="flex items-center justify-end gap-3">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="flex items-center gap-2 rounded-sm border border-stone bg-ivory-light px-2 py-1 hover:border-gold transition-colors focus:outline-none"
                  >
                    <img
                      src={currentUser.profilePicture}
                      alt={currentUser.username}
                      className="w-7 h-7 rounded-sm object-cover"
                    />
                    <span className="hidden sm:inline text-xs font-medium text-charcoal max-w-[100px] truncate">
                      @{currentUser.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-ink-muted" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-60 bg-ivory-light border-stone text-charcoal rounded-sm"
                  align="end"
                >
                  <DropdownMenuLabel className="font-serif text-base">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-stone" />
                  <DropdownMenuItem className="block text-sm focus:bg-ivory">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold">@{currentUser.username}</span>
                      <span className="text-xs text-ink-muted">
                        {currentUser.email}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-stone" />
                  <DropdownMenuItem
                    asChild
                    className="font-medium cursor-pointer focus:bg-ivory"
                  >
                    <Link to="/dashboard?tab=profile">Profile</Link>
                  </DropdownMenuItem>
                  {currentUser.isAdmin && (
                    <DropdownMenuItem
                      asChild
                      className="font-semibold cursor-pointer text-burgundy focus:bg-ivory focus:text-burgundy"
                    >
                      <Link to="/admin/dashboard">Admin Dashboard</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-stone" />
                  <DropdownMenuItem
                    className="font-medium cursor-pointer text-burgundy focus:bg-ivory focus:text-burgundy"
                    onClick={handleSignout}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/sign-in">
                  <Button
                    variant="outline"
                    className="border-stone bg-transparent text-charcoal hover:bg-charcoal hover:text-ivory hover:border-charcoal text-xs uppercase tracking-wider font-semibold px-3.5 h-8 rounded-sm transition-colors"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" className="hidden sm:inline-block">
                  <Button className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-wider font-semibold px-4 h-8 rounded-sm transition-colors">
                    Subscribe
                  </Button>
                </Link>
              </div>
            )}

            <button
              type="button"
              className="md:hidden p-2 text-charcoal hover:text-burgundy transition-colors"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Editorial Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 border-b border-stone ${
          scrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-[0_6px_24px_-12px_rgba(23,23,23,0.18)]"
            : "bg-ivory-light"
        }`}
      >
        <nav className="hidden md:block">
          <div className="max-w-7xl mx-auto px-6">
            <ul className="flex items-center justify-center gap-x-7 py-3">
              {PRIMARY_NAV.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `relative inline-block text-xs font-semibold tracking-[0.14em] uppercase py-1 transition-colors group ${
                        isActive
                          ? "text-burgundy"
                          : "text-charcoal hover:text-burgundy"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span>{item.label}</span>
                        {isActive ? (
                          <motion.span
                            layoutId="editorial-nav-underline"
                            transition={{ duration: 0.3, ease: EDITORIAL_EASE }}
                            className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-burgundy"
                          />
                        ) : (
                          <span className="absolute left-0 right-0 -bottom-0.5 h-[1.5px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}

              {/* Editorial More Dropdown */}
              <li>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 text-xs font-semibold tracking-[0.14em] uppercase py-1 text-charcoal hover:text-burgundy transition-colors focus:outline-none"
                    >
                      More <ChevronDown className="w-3.5 h-3.5 text-gold" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-52 bg-ivory-light border-stone rounded-sm shadow-lg py-1.5"
                  >
                    {MORE_NAV.map((item) => (
                      <DropdownMenuItem
                        key={item.to}
                        asChild
                        className="text-xs font-medium tracking-wider uppercase text-charcoal hover:text-burgundy focus:bg-ivory focus:text-burgundy cursor-pointer py-2 px-3"
                      >
                        <Link to={item.to}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: EDITORIAL_EASE }}
              className="md:hidden overflow-hidden bg-ivory-light border-b border-stone"
            >
              <div className="px-4 py-4 space-y-4">
                <form
                  className="flex items-center bg-ivory border border-stone rounded-sm px-3 py-2"
                  onSubmit={handleSubmit}
                >
                  <input
                    type="text"
                    placeholder="Search articles, movies, stars..."
                    className="focus:outline-none bg-transparent text-sm w-full text-charcoal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button type="submit" aria-label="Search">
                    <SearchIcon className="w-4 h-4 text-ink-muted hover:text-burgundy" />
                  </button>
                </form>

                <ul className="grid grid-cols-2 gap-1.5">
                  {ALL_MOBILE_NAV.map((item) => (
                    <li key={item.to}>
                      <NavLink
                        to={item.to}
                        end={item.to === "/"}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors ${
                            isActive
                              ? "bg-burgundy text-ivory"
                              : "text-charcoal hover:bg-stone/40"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}

export default Header
