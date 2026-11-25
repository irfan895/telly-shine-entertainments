import Advertise from "@/components/shared/Advertise"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { ArrowRight, Youtube, Instagram, Facebook, Flame, Sparkles } from "lucide-react"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

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

const CATEGORY_SECTIONS = [
  { name: "Bollywood", slug: "bollywood" },
  { name: "Hollywood", slug: "hollywood" },
  { name: "TV & Television", slug: "television" },
  { name: "Digital", slug: "digital" },
  { name: "Movies", slug: "movies" },
  { name: "Stories", slug: "stories" },
  { name: "Blog", slug: "blog" },
]

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/post/getposts?limit=50")
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts || [])
        }
      } catch (error) {
        console.error("Unable to load articles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const featuredPosts = posts.filter((p) => p.is_featured).slice(0, 3)
  const heroPost = featuredPosts[0] || posts[0] || null
  const trendingPosts = posts.filter((p) => p.is_trending).slice(0, 3)
  const latestPosts = posts.slice(0, 6)

  const getPostsByCategory = (slug) =>
    posts
      .filter((p) => {
        const pSlug = (p.category_slug || "").toLowerCase()
        if (slug === "digital") return pSlug === "digital" || pSlug === "digital-ott"
        return pSlug === slug
      })
      .slice(0, 3)

  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
          {heroPost ? (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {heroPost.category || "Featured Story"}
                </span>
                <h1 className="mt-4 text-3xl md:text-5xl font-black leading-tight text-white">
                  {heroPost.title}
                </h1>
                {(heroPost.description || heroPost.excerpt) && (
                  <p className="mt-4 text-slate-300 text-base md:text-lg leading-relaxed line-clamp-3">
                    {heroPost.description || heroPost.excerpt}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to={`/post/${heroPost.slug}`}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/news">
                    <Button
                      variant="outline"
                      className="border-white/40 bg-transparent text-white hover:bg-white hover:text-slate-950"
                    >
                      All Articles
                    </Button>
                  </Link>
                </div>
              </div>
              <Link
                to={`/post/${heroPost.slug}`}
                className="block rounded-2xl overflow-hidden shadow-2xl h-64 md:h-96 bg-slate-900"
              >
                <img
                  src={heroPost.image || heroPost.featured_image}
                  alt={heroPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
          ) : (
            <div className="max-w-3xl py-6">
              <p className="text-red-400 font-bold uppercase tracking-widest text-xs">
                Telly Shine Entertainment
              </p>
              <h1 className="mt-3 text-4xl md:text-6xl font-black leading-tight">
                Your Entertainment, In The Spotlight
              </h1>
              <p className="mt-4 text-slate-300 text-lg leading-relaxed">
                Television, Digital, Movies, Stories, and Podcasts — curated by Telly Shine Entertainment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Articles */}
      {featuredPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-red-600" />
              <h2 className="text-2xl font-black text-slate-950">Featured Articles</h2>
            </div>
            <Link to="/news" className="text-sm font-semibold text-red-600 hover:underline">
              Explore all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Latest News */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-100">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-red-600">
              Fresh Off The Desk
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-slate-950 mt-1">
              Latest News
            </h2>
          </div>
          <Link to="/news" className="text-sm font-semibold text-red-600 hover:underline">
            View all articles →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : latestPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center text-slate-500">
            No published articles yet. Stories published by the Telly Shine editorial team will appear here.
          </div>
        )}
      </section>

      {/* Trending Articles */}
      {trendingPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-b border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-600" />
              <h2 className="text-2xl font-black text-slate-950">Trending Now</h2>
            </div>
            <Link to="/news" className="text-sm font-semibold text-red-600 hover:underline">
              See more →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <Advertise />
      </div>

      {/* Category Sections: Blog, Television, Digital, Movies, Stories, Podcasts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 divide-y divide-gray-100">
        {CATEGORY_SECTIONS.map((cat) => {
          const catPosts = getPostsByCategory(cat.slug)
          return (
            <section key={cat.slug} className="py-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-slate-950 border-l-4 border-red-600 pl-3">
                  {cat.name}
                </h2>
                <Link
                  to={`/category/${cat.slug}`}
                  className="text-sm font-semibold text-red-600 hover:underline"
                >
                  More {cat.name} →
                </Link>
              </div>
              {catPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catPosts.map((post) => (
                    <PostCard key={post._id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center text-sm text-slate-500">
                  No published articles in {cat.name} yet.
                </div>
              )}
            </section>
          )
        })}
      </div>

      {/* Follow Us Section */}
      <section className="bg-gray-100 border-t border-gray-200 py-14 mt-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-black text-slate-950">
            Follow Telly Shine Entertainment
          </h2>
          <p className="mt-3 text-slate-600">
            Join our community across our official social media channels for daily updates.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-6 py-3 font-semibold text-slate-900 shadow-sm hover:border-red-600 hover:text-red-600 transition-colors"
              >
                <Icon size={19} /> {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
