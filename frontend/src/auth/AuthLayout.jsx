import React from "react"
import { Link } from "react-router-dom"
import { PageTransition } from "@/components/editorial/MotionPrimitives"

const AuthLayout = ({ children, title, description }) => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 bg-ivory-light border border-stone rounded-sm shadow-[0_20px_50px_-20px_rgba(23,23,23,0.2)] overflow-hidden">
          {/* Left Editorial Section */}
          <div className="bg-charcoal text-ivory p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,154,85,0.14),transparent_60%)]"
            />
            <div className="relative">
              <Link to="/" className="inline-block">
                <span className="font-serif text-3xl font-black tracking-tight text-ivory">
                  Telly <span className="text-burgundy italic font-bold">Shine</span>
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.26em] text-gold mt-1">
                  Entertainment
                </span>
              </Link>

              <h1 className="font-serif text-3xl md:text-4xl font-bold mt-10 leading-tight text-ivory">
                Your World of Entertainment, Curated.
              </h1>

              <p className="text-ivory/70 mt-4 text-sm leading-relaxed">
                Discover the latest entertainment news, celebrity profiles,
                television updates, and exclusive cinema stories.
              </p>
            </div>

            <p className="relative text-xs text-ivory/45 mt-12">
              &copy; {new Date().getFullYear()} Telly Shine Entertainment
            </p>
          </div>

          {/* Right Form Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-ivory-light">
            <h2 className="font-serif text-3xl font-bold text-charcoal">
              {title || "Welcome Back"}
            </h2>

            <p className="text-ink-muted text-sm mt-2 mb-8">
              {description || "Access your Telly Shine account."}
            </p>

            {children}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

export default AuthLayout
