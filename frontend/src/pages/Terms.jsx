import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import { PageTransition } from "@/components/editorial/MotionPrimitives"

const Terms = () => {
  useEffect(() => {
    document.title = "Terms and Conditions | Telly Shine Entertainment"
  }, [])

  return (
    <PageTransition>
      <main className="bg-ivory min-h-screen py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto bg-ivory-light border border-stone rounded-sm p-8 sm:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-burgundy">
            Editorial Guidelines
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-1">
            Terms and Conditions
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
              By accessing and using Telly Shine Entertainment, you agree to comply with these Terms and Conditions.
            </p>
            <h2 className="font-serif text-xl font-bold text-charcoal pt-2">
              Editorial Content
            </h2>
            <p>
              All articles, reviews, interviews, and media published on Telly Shine Entertainment are for informational and entertainment purposes. Unauthorized reproduction or redistribution of original content is prohibited.
            </p>
            <h2 className="font-serif text-xl font-bold text-charcoal pt-2">
              Community &amp; Comments
            </h2>
            <p>
              Users must post respectful, lawful comments. Administrators reserve the right to moderate or remove spam, abusive, or misleading content.
            </p>
            <p>
              If you have any questions regarding these terms, please visit our{" "}
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

export default Terms
