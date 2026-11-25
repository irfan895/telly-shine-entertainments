import React, { useState } from "react"
import { NavLink, Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { signOutSuccess } from "@/redux/user/userSlice"
import { signOut } from "firebase/auth"
import { auth } from "@/firebase"
import {
  LayoutDashboard,
  FilePlus2,
  FileText,
  Users,
  MessageSquare,
  Settings,
  Tags,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react"

const ADMIN_NAV = [
  { label: "Dashboard", to: "/admin/dashboard", Icon: LayoutDashboard },
  { label: "Create Article", to: "/admin/create-post", Icon: FilePlus2 },
  { label: "Manage Articles", to: "/admin/posts", Icon: FileText },
  { label: "Categories", to: "/admin/categories", Icon: Tags },
  { label: "Users", to: "/admin/users", Icon: Users },
  { label: "Comments", to: "/admin/comments", Icon: MessageSquare },
  { label: "Settings", to: "/admin/settings", Icon: Settings },
]

const AdminLayout = ({ children, title }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch("/api/user/signout", {
        method: "POST",
        credentials: "include",
      })
      if (auth) {
        try {
          await signOut(auth)
        } catch {}
      }
      dispatch(signOutSuccess())
      navigate("/admin/login")
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 w-64">
      <div className="p-5 border-b border-slate-800">
        <Link to="/admin/dashboard" className="block">
          <span className="text-lg font-black tracking-tight text-white">
            <span className="text-red-500">Telly Shine</span> Admin
          </span>
        </Link>
        {currentUser && (
          <p className="text-xs text-slate-400 mt-1 truncate">
            {currentUser.email}
          </p>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map(({ label, to, Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-red-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}

        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-4"
        >
          <ExternalLink className="w-4 h-4 shrink-0" />
          <span>Public Website</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-slate-800">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">{sidebarContent}</div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="lg:hidden p-2 rounded-md text-slate-700 hover:bg-gray-100"
              aria-label="Toggle admin menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {title || "Admin Panel"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/create-post"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 transition-colors"
            >
              <FilePlus2 className="w-4 h-4" /> New Article
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
