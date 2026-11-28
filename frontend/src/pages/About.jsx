import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PageTransition, RevealSection } from "@/components/editorial/MotionPrimitives"

const About = () => (
  <PageTransition>
    <main className="min-h-screen bg-ivory">
      <section className="bg-charcoal text-ivory px-6 py-16 md:py-20 text-center border-b border-soft-black">
        <p className="text-gold font-semibold uppercase tracking-[0.22em] text-xs">
          Who We Are
        </p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold">
          Telly Shine Entertainment
        </h1>
        <p className="mt-5 max-w-2xl mx-auto text-ivory/75 leading-relaxed text-base md:text-lg">
          An independent entertainment &amp; culture publication dedicated to Bollywood,
          Hollywood, Television, Digital OTT, and cinema storytelling.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <RevealSection>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy">
            Our Editorial Vision
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-charcoal">
            Entertainment That Keeps You Connected
          </h2>
          <p className="mt-5 text-ink-muted leading-8 text-base">
            Telly Shine Entertainment brings readers a curated space to discover breaking
            dispatches, thoughtful film reviews, television updates, and exclusive celebrity
            interviews. Follow our official social channels to stay connected with our daily editions.
          </p>
          <Link to="/news" className="inline-block mt-8">
            <Button className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-7 h-10">
              Explore Articles
            </Button>
          </Link>
        </RevealSection>
      </section>
    </main>
  </PageTransition>
)

export default About
