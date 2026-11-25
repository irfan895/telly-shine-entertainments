import React, { useEffect } from "react"
import { Link } from "react-router-dom"

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Telly Shine Entertainment"
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-black text-slate-950">Privacy Policy</h1>
      <p className="text-sm text-slate-500 mt-2">
        Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>
      <div className="mt-8 space-y-5 text-slate-700 leading-7 text-sm sm:text-base">
        <p>
          Telly Shine Entertainment respects your privacy and is committed to protecting the personal information you share with us when reading articles, commenting, or creating an account.
        </p>
        <h2 className="text-xl font-bold text-slate-900">Information We Collect</h2>
        <p>
          When you register or sign in (via email/password or Google Authentication), we collect your username, email address, and profile photo to manage your session and comments. When you submit a contact inquiry, we store your name, email, and message so our editorial team can respond.
        </p>
        <h2 className="text-xl font-bold text-slate-900">Cookies &amp; Security</h2>
        <p>
          We use secure HTTP-only authentication cookies to keep your session protected. We never sell your personal data to third parties.
        </p>
        <p>
          For privacy questions, please reach out via our{" "}
          <Link to="/contact" className="text-red-600 font-semibold hover:underline">
            Contact page
          </Link>.
        </p>
      </div>
    </main>
  )
}

export default PrivacyPolicy
