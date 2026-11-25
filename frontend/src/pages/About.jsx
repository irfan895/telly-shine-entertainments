import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

const About = () => (
  <main className="min-h-screen bg-slate-50">
    <section className="bg-slate-950 text-white px-6 py-16 text-center">
      <p className="text-rose-400 font-semibold uppercase tracking-widest text-sm">Who we are</p>
      <h1 className="mt-3 text-4xl md:text-5xl font-black">Telly Shine Entertainment</h1>
      <p className="mt-5 max-w-2xl mx-auto text-slate-300 leading-8">
        A home for entertainment news, celebrity updates, television and film stories,
        and the latest trending moments.
      </p>
    </section>
    <section className="max-w-5xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl font-bold text-slate-900">Entertainment that keeps you connected</h2>
      <p className="mt-5 text-slate-600 leading-8">
        Telly Shine Entertainment brings readers a place to discover and explore stories
        from the entertainment world. Browse the latest articles and follow our official
        social channels to stay connected with our updates.
      </p>
      <Link to="/news"><Button className="mt-8 bg-rose-600 hover:bg-rose-700">Explore Articles</Button></Link>
    </section>
  </main>
)

export default About
