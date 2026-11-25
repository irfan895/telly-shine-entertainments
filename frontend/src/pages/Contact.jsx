import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Youtube, Instagram, Facebook, Mail, Send } from "lucide-react"

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
    <main className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b border-gray-200 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Get In Touch
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 mt-2">
            Contact Telly Shine Entertainment
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Have a news tip, press release, collaboration inquiry, or feedback? Reach out to our editorial team.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {submitted && (
            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
              Your message has been received. Our editorial team will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Your Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <Input
                type="text"
                placeholder="Press release, story tip, feedback..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <Textarea
                rows={5}
                required
                placeholder="Write your message here..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white px-6"
            >
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-red-600" /> Editorial Desk
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Telly Shine Entertainment covers Indian Television, Digital/OTT, Movies, Stories, and Podcasts.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 p-6 bg-gray-50">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Follow Us</h2>
            <div className="space-y-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors"
                >
                  <Icon className="w-5 h-5" /> {label}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </main>
  )
}

export default Contact
