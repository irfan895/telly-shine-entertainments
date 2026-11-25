import React, { useEffect } from "react"
import { Link } from "react-router-dom"

const Terms = () => {
  useEffect(() => {
    document.title = "Terms and Conditions | Telly Shine Entertainment"
  }, [])

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 min-h-screen bg-white">
      <h1 className="text-3xl md:text-4xl font-black text-slate-950">Terms and Conditions</h1>
      <p className="text-sm text-slate-500 mt-2">
        Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
      </p>
      <div className="mt-8 space-y-5 text-slate-700 leading-7 text-sm sm:text-base">
        <p>
          By accessing and using Telly Shine Entertainment, you agree to comply with these Terms and Conditions.
        </p>
        <h2 className="text-xl font-bold text-slate-900">Editorial Content</h2>
        <p>
          All articles, reviews, interviews, and media published on Telly Shine Entertainment are for informational and entertainment purposes. Unauthorized reproduction or redistribution of original content is prohibited.
        </p>
        <h2 className="text-xl font-bold text-slate-900">Community &amp; Comments</h2>
        <p>
          Users must post respectful, lawful comments. Administrators reserve the right to moderate or remove spam, abusive, or misleading content.
        </p>
        <p>
          If you have any questions regarding these terms, please visit our{" "}
          <Link to="/contact" className="text-red-600 font-semibold hover:underline">
            Contact page
          </Link>.
        </p>
      </div>
    </main>
  )
}

export default Terms
