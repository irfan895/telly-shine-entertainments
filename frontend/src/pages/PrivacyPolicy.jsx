import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { PageTransition } from "@/components/editorial/MotionPrimitives"

const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Telly Shine Entertainment"
  }, [])

  return (
    <PageTransition>
      <main className="bg-ivory min-h-screen py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-ivory-light border border-stone rounded-sm p-8 sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-burgundy">
            Legal &amp; Trust
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-ink-muted mt-2 pb-6 border-b border-stone">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="mt-6 space-y-5 text-soft-black leading-relaxed text-sm sm:text-base">
            <p>
              Telly Shine Entertainment respects your privacy and is committed to protecting the personal information you share with us when reading articles, commenting, or creating an account.
            </p>
            <h2 className="font-serif text-xl font-bold text-charcoal pt-2">
              Information We Collect
            </h2>
            <p>
              When you register or sign in (via email/password or Google Authentication), we collect your username, email address, and profile photo to manage your session and comments. When you submit a contact inquiry, we store your name, email, and message so our editorial team can respond.
            </p>
            <h2 className="font-serif text-xl font-bold text-charcoal pt-2">
              Cookies &amp; Security
            </h2>
            <p>
              We use secure HTTP-only authentication cookies to keep your session protected. We never sell your personal data to third parties.
            </p>
            <p>
              For privacy questions, please reach out via our{" "}
              <Link to="/contact" className="text-burgundy font-semibold hover:underline">
                Contact page
              </Link>.
            </p>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}

export default PrivacyPolicy
