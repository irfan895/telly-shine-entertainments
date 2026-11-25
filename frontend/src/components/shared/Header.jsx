import React, { useEffect, useState } from "react"
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"
import { FaSearch, FaYoutube, FaInstagram, FaFacebook, FaBars, FaTimes } from "react-icons/fa"
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

const NAV_ITEMS = [
  { label: "Home", to: "/" },
  { label: "Latest News", to: "/news" },
  { label: "Bollywood", to: "/category/bollywood" },
  { label: "Hollywood", to: "/category/hollywood" },
  { label: "TV & Television", to: "/category/television" },
  { label: "Digital", to: "/category/digital" },
  { label: "Movies", to: "/category/movies" },
  { label: "Stories", to: "/category/stories" },
  { label: "Contact", to: "/contact" },
]

const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get("searchTerm")
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
    setMobileMenuOpen(false)
  }, [location.pathname, location.search])

  const handleSignout = async () => {
    try {
      await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      })
      if (auth) {
        try {
          await signOut(auth)
        } catch { }
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

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link to="/" className="shrink-0">
          <span className="font-black text-xl sm:text-2xl tracking-tight">
            <span className="text-red-600">Telly Shine</span>{" "}
            <span className="text-slate-950">Entertainment</span>
          </span>
        </Link>

        <form
          className="hidden sm:flex items-center bg-gray-100 border border-gray-200 rounded-full px-4 py-1.5 w-64 lg:w-80"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Search news, shows, movies..."
            className="focus:outline-none bg-transparent text-sm w-full text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" aria-label="Search">
            <FaSearch className="text-slate-600 hover:text-red-600 transition-colors" />
          </button>
        </form>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 text-slate-700">
            <a
              href="https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="hover:text-red-600 transition-colors"
            >
              <FaYoutube size={19} />
            </a>
            <a
              href="https://www.instagram.com/telly_shinee_official?jplx=MTJwaThvMWc2NnkyOA=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-pink-600 transition-colors"
            >
              <FaInstagram size={19} />
            </a>
            <a
              href="https://www.facebook.com/share/1F944M7d5r/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-blue-600 transition-colors"
            >
              <FaFacebook size={19} />
            </a>
          </div>

          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="rounded-full focus:outline-none ring-2 ring-transparent hover:ring-red-600 transition"
                >
                  <img
                    src={currentUser.profilePicture}
                    alt={currentUser.username}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-60" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="block font-semibold text-sm">
                  <div className="flex flex-col gap-0.5">
                    <span>@{currentUser.username}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {currentUser.email}
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="font-medium cursor-pointer">
                  <Link to="/dashboard?tab=profile">Profile</Link>
                </DropdownMenuItem>
                {currentUser.isAdmin && (
                  <DropdownMenuItem asChild className="font-medium cursor-pointer text-red-600">
                    <Link to="/admin/dashboard">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="font-medium cursor-pointer text-red-600"
                  onClick={handleSignout}
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/sign-in">
              <Button className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 h-9">
                Sign In
              </Button>
            </Link>
          )}

          <button
            type="button"
            className="md:hidden p-2 text-slate-900"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Horizontal Editorial Navigation Bar (Light Grey Background, Black Text) */}
      <nav className="hidden md:block bg-gray-100 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-semibold tracking-wide uppercase pb-1 transition-all border-b-2 ${isActive
                      ? "text-red-600 border-red-600"
                      : "text-black border-transparent hover:border-black hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-100 border-t border-gray-200 px-4 py-4 space-y-3">
          <form
            className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Search articles..."
              className="focus:outline-none bg-transparent text-sm w-full text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FaSearch className="text-slate-600" />
            </button>
          </form>

          <ul className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-sm font-semibold uppercase ${isActive
                      ? "bg-red-600 text-white"
                      : "text-black hover:bg-gray-200"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header
