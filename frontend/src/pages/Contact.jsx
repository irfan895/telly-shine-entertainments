import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Youtube, Instagram, Facebook, Mail, Send } from "lucide-react"
import { PageTransition } from "@/components/editorial/MotionPrimitives"

const SOCIAL_LINKS = [
  {
    label: "YouTube",
    href: "https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa",
    Icon: Youtube,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/telly_shinee_official?jplx=MTJwaThvMWc2NnkyOA==",
    Icon: Instagram,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/share/1F944M7d5r/",
    Icon: Facebook,
  },
]

const Contact = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return

    try {
      setSubmitting(true)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to send message")
      }
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out to Telly Shine Entertainment.",
      })
    } catch (error) {
      toast({
        title: "Could not send message",
        description: error.message,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-ivory">
        <section className="bg-charcoal text-ivory border-b border-soft-black py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Get In Touch
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mt-2">
              Contact Telly Shine Entertainment
            </h1>
            <p className="text-ivory/70 mt-2 max-w-2xl text-sm sm:text-base">
              Have a news tip, press release, collaboration inquiry, or feedback? Reach out to our editorial desk.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {submitted && (
              <div className="mb-6 rounded-sm border border-gold bg-ivory-light p-4 text-charcoal text-sm">
                Your message has been received. Our editorial team will get back to you soon.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-4 bg-ivory-light border border-stone rounded-sm p-6 sm:p-8"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="Enter your name"
                    className="bg-ivory border-stone rounded-sm"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="bg-ivory border-stone rounded-sm"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="Press release, story tip, feedback..."
                  className="bg-ivory border-stone rounded-sm"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted mb-1.5">
                  Message
                </label>
                <Textarea
                  rows={5}
                  required
                  placeholder="Write your message here..."
                  className="bg-ivory border-stone rounded-sm"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-6 h-10"
              >
                <Send className="w-3.5 h-3.5 mr-2" />
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          <aside className="space-y-6">
            <div className="rounded-sm border border-stone p-6 bg-ivory-light">
              <h2 className="font-serif text-lg font-bold text-charcoal flex items-center gap-2">
                <Mail className="w-4 h-4 text-burgundy" /> Editorial Desk
              </h2>
              <p className="text-sm text-ink-muted mt-2 leading-relaxed">
                Telly Shine Entertainment covers Bollywood, Hollywood, Indian Television, Digital/OTT, Movies, and Celebrity Stories.
              </p>
            </div>

            <div className="rounded-sm border border-stone p-6 bg-ivory-light">
              <h2 className="font-serif text-lg font-bold text-charcoal mb-4">
                Follow Us
              </h2>
              <div className="space-y-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-burgundy transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gold" /> {label}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </PageTransition>
  )
}

export default Contact
