import PostCard from "@/components/shared/PostCard"
import ErrorBoundary from "@/components/shared/ErrorBoundary"
import { Button } from "@/components/ui/button"
import { getFallbackImage, handleImageError } from "@/lib/imageFallback"
import { normalizeArticles } from "@/lib/rssNormalize"
import {
  EDITORIAL_EASE,
  PageTransition,
  RevealSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/editorial/MotionPrimitives"
import { motion } from "framer-motion"
import {
  ArrowRight,
  ArrowUpRight,
  Youtube,
  Instagram,
  Facebook,
  Play,
  Mail,
} from "lucide-react"
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

const SectionHeading = ({ kicker, title, linkTo, linkLabel, dark = false }) => (
  <div
    className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 mb-8 border-b ${
      dark ? "border-ivory/15" : "border-stone"
    }`}
  >
    <div>
      {kicker && (
        <p
          className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
            dark ? "text-gold" : "text-burgundy"
          }`}
        >
          {kicker}
        </p>
      )}
      <h2
        className={`font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mt-1 ${
          dark ? "text-ivory" : "text-charcoal"
        }`}
      >
        {title}
      </h2>
    </div>
    {linkTo && (
      <Link
        to={linkTo}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] transition-colors shrink-0 ${
          dark
            ? "text-gold hover:text-ivory"
            : "text-burgundy hover:text-charcoal"
        }`}
      >
        {linkLabel} <ArrowUpRight className="w-4 h-4" />
      </Link>
    )}
  </div>
)

const EmptyCategoryState = ({ name, dark = false }) => (
  <div
    className={`rounded-sm border border-dashed p-10 text-center text-sm ${
      dark
        ? "border-ivory/20 text-ivory/55 bg-soft-black/40"
        : "border-stone text-ink-muted bg-ivory-light/60"
    }`}
  >
    No published articles in {name} yet. Stories from the Telly Shine editorial desk will appear here.
  </div>
)

const CategoryBand = ({
  kicker,
  title,
  slug,
  posts,
  dark = false,
  cream = false,
  asymmetric = false,
}) => {
  const bgClass = dark
    ? "bg-charcoal text-ivory"
    : cream
    ? "bg-ivory-light border-y border-stone"
    : "bg-ivory"

  return (
    <section className={`${bgClass} py-14 md:py-16`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealSection>
          <SectionHeading
            kicker={kicker}
            title={title}
            linkTo={`/category/${slug}`}
            linkLabel={`Explore ${title}`}
            dark={dark}
          />
        </RevealSection>

        {posts.length > 0 ? (
          asymmetric && posts.length >= 2 ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
              <RevealSection className="lg:col-span-7">
                <ErrorBoundary inline>
                  <PostCard post={posts[0]} variant="featured" />
                </ErrorBoundary>
              </RevealSection>
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                {posts.slice(1, 3).map((post) => (
                  <RevealSection key={post._id} delay={0.1}>
                    <ErrorBoundary inline>
                      <PostCard post={post} variant={dark ? "dark" : "default"} />
                    </ErrorBoundary>
                  </RevealSection>
                ))}
              </div>
            </div>
          ) : (
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post) => (
                <StaggerItem key={post._id}>
                  <ErrorBoundary inline>
                    <PostCard post={post} variant={dark ? "dark" : "default"} />
                  </ErrorBoundary>
                </StaggerItem>
              ))}
            </StaggerGrid>
          )
        ) : (
          <EmptyCategoryState name={title} dark={dark} />
        )}
      </div>
    </section>
  )
}

const Home = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState("")
  const [subscribing, setSubscribing] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!newsletterEmail.trim() || subscribing) return
    try {
      setSubscribing(true)
      setNewsletterStatus("")
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      })
      const data = await res.json()
      setNewsletterStatus(data.message || "Subscribed!")
      if (res.ok) setNewsletterEmail("")
    } catch {
      setNewsletterStatus("Unable to subscribe right now. Please try again.")
    } finally {
      setSubscribing(false)
    }
  }

  useEffect(() => {
    document.title =
      "Telly Shine Entertainment — Bollywood, Hollywood, TV, Digital & Cinema"
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/post/getposts?limit=50")
        const data = await res.json()
        if (res.ok) {
          setPosts(normalizeArticles(data.posts || []))
        }
      } catch (error) {
        console.error("Unable to load articles:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const featuredPosts = posts.filter((p) => p.is_featured).slice(0, 4)
  const heroPost = featuredPosts[0] || posts[0] || null
  const heroSidePosts = (
    featuredPosts.length > 1 ? featuredPosts.slice(1, 4) : posts.slice(1, 4)
  ).filter((p) => !heroPost || p._id !== heroPost._id)

  const breakingPosts = posts.filter((p) => p.is_breaking)
  const tickerPosts = (breakingPosts.length > 0 ? breakingPosts : posts).slice(0, 8)

  const trendingPosts = posts.filter((p) => p.is_trending).slice(0, 5)
  const topHeadlines = (trendingPosts.length > 0 ? trendingPosts : posts.slice(0, 5))
  const leadHeadline = topHeadlines[0] || null
  const headlineList = topHeadlines.slice(1, 5)

  const latestPosts = posts.slice(0, 6)

  const getPostsByCategory = (slugs) => {
    const slugList = Array.isArray(slugs) ? slugs : [slugs]
    return posts
      .filter((p) => {
        const pSlug = (p.category_slug || "").toLowerCase()
        return slugList.includes(pSlug)
      })
      .slice(0, 3)
  }

  const bollywoodPosts = getPostsByCategory("bollywood")
  const hollywoodPosts = getPostsByCategory("hollywood")
  const tvPosts = getPostsByCategory("television")
  const digitalPosts = getPostsByCategory(["digital", "digital-ott"])
  const moviesPosts = getPostsByCategory("movies")
  const celebrityStoriesPosts = getPostsByCategory(["celebrity", "stories"])

  return (
    <PageTransition>
      <main className="bg-ivory min-h-screen text-charcoal">
        {/* 2. Breaking News Animated Ticker */}
        {tickerPosts.length > 0 && (
          <div className="bg-charcoal text-ivory border-b border-soft-black overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-10">
              <span className="shrink-0 inline-flex items-center gap-2 bg-burgundy text-ivory px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] rounded-sm mr-4">
                <span className="w-1.5 h-1.5 rounded-full bg-ivory animate-pulse" />
                Breaking
              </span>
              <div className="relative flex-1 overflow-hidden">
                <div className="animate-ticker items-center gap-10 whitespace-nowrap text-xs font-medium text-ivory/85">
                  {[...tickerPosts, ...tickerPosts].map((item, idx) => (
                    <Link
                      key={`${item._id}-${idx}`}
                      to={`/post/${item.slug}`}
                      className="inline-flex items-center gap-3 hover:text-gold transition-colors"
                    >
                      <span className="text-gold text-[10px]">&diams;</span>
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Cinematic Hero Section */}
        <section className="relative bg-charcoal text-ivory overflow-hidden border-b border-soft-black">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,154,85,0.12),transparent_55%)]"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-16 relative">
            {heroPost ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                {/* Main Cinematic Lead */}
                <div className="lg:col-span-8 flex flex-col justify-between">
                  <Link
                    to={`/post/${heroPost.slug}`}
                    className="group relative block h-72 sm:h-96 md:h-[460px] rounded-sm overflow-hidden border border-ivory/15 bg-soft-black"
                  >
                    <motion.img
                      initial={{ scale: 1.06, opacity: 0.7 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.9, ease: EDITORIAL_EASE }}
                      src={
                        heroPost.image ||
                        heroPost.featured_image ||
                        getFallbackImage(heroPost.category_slug)
                      }
                      alt={heroPost.title}
                      onError={(e) => handleImageError(e, heroPost.category_slug)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/45 to-transparent" />

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10">
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.15, ease: EDITORIAL_EASE }}
                      >
                        <span className="inline-block bg-burgundy text-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm">
                          {heroPost.category || "Cover Story"}
                        </span>
                      </motion.div>

                      <motion.h1
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, delay: 0.25, ease: EDITORIAL_EASE }}
                        className="mt-3 font-serif text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.12] text-ivory group-hover:text-gold transition-colors"
                      >
                        {heroPost.title}
                      </motion.h1>

                      {(heroPost.description || heroPost.excerpt) && (
                        <motion.p
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.35, ease: EDITORIAL_EASE }}
                          className="mt-3 text-ivory/80 text-sm sm:text-base max-w-2xl line-clamp-2 leading-relaxed"
                        >
                          {heroPost.description || heroPost.excerpt}
                        </motion.p>
                      )}
                    </div>
                  </Link>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45, ease: EDITORIAL_EASE }}
                    className="mt-5 flex flex-wrap items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 text-xs text-ivory/60">
                      <span className="text-gold font-semibold uppercase tracking-widest">
                        Featured Dispatch
                      </span>
                      {heroPost.author?.name && (
                        <>
                          <span>&bull;</span>
                          <span>By {heroPost.author.name}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Link to={`/post/${heroPost.slug}`}>
                        <Button className="bg-burgundy hover:bg-burgundy-dark text-ivory text-xs uppercase tracking-wider font-semibold rounded-sm px-5 h-9">
                          Read Full Story <ArrowRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                      </Link>
                      <Link to="/news">
                        <Button
                          variant="outline"
                          className="border-ivory/25 bg-transparent text-ivory hover:bg-ivory hover:text-charcoal text-xs uppercase tracking-wider font-semibold rounded-sm px-4 h-9"
                        >
                          All Stories
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                </div>

                {/* Right Editorial Rail */}
                <aside className="lg:col-span-4 bg-soft-black/70 border border-ivory/10 rounded-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-ivory/15">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                        Editor&apos;s Picks
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-ivory/45">
                        Spotlight
                      </span>
                    </div>

                    {heroSidePosts.length > 0 ? (
                      <div className="divide-y divide-ivory/10 mt-2">
                        {heroSidePosts.map((item) => (
                          <Link
                            key={item._id}
                            to={`/post/${item.slug}`}
                            className="group flex gap-3.5 py-4 first:pt-3 last:pb-1"
                          >
                            <img
                              src={
                                item.image ||
                                item.featured_image ||
                                getFallbackImage(item.category_slug)
                              }
                              alt={item.title}
                              onError={(e) => handleImageError(e, item.category_slug)}
                              className="w-20 h-20 rounded-sm object-cover shrink-0 border border-ivory/10 group-hover:opacity-90 transition-opacity"
                              loading="lazy"
                            />
                            <div className="min-w-0">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                                {item.category || "Editorial"}
                              </span>
                              <h3 className="mt-1 font-serif text-sm sm:text-base font-bold text-ivory group-hover:text-gold transition-colors line-clamp-2 leading-snug">
                                {item.title}
                              </h3>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-ivory/55 py-6">
                        Curated stories from Bollywood, Hollywood, Television &amp; Digital OTT.
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-ivory/15 flex items-center justify-between text-xs">
                    <span className="text-ivory/60">Telly Shine Edition</span>
                    <Link
                      to="/news"
                      className="text-gold hover:text-ivory font-semibold uppercase tracking-wider inline-flex items-center gap-1"
                    >
                      Archive <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="max-w-3xl py-10">
                <p className="text-gold font-semibold uppercase tracking-[0.24em] text-xs">
                  Telly Shine Entertainment
                </p>
                <h1 className="mt-3 font-serif text-4xl md:text-6xl font-bold leading-tight text-ivory">
                  Cinema, Television &amp; Culture, Curated.
                </h1>
                <p className="mt-4 text-ivory/75 text-lg leading-relaxed">
                  Bollywood, Hollywood, TV &amp; Television, Digital OTT, and exclusive celebrity stories.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Top Headlines Section (Asymmetric Magazine Layout) */}
        {leadHeadline && (
          <section className="py-14 md:py-16 bg-ivory-light border-b border-stone">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <RevealSection>
                <SectionHeading
                  kicker="Front Page"
                  title="Top Headlines"
                  linkTo="/news"
                  linkLabel="All Headlines"
                />
              </RevealSection>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <RevealSection className="lg:col-span-7">
                  <PostCard post={leadHeadline} variant="featured" />
                </RevealSection>

                <RevealSection delay={0.12} className="lg:col-span-5">
                  <div className="bg-ivory border border-stone rounded-sm p-6">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-burgundy pb-3 border-b border-stone">
                      Most Read Dispatches
                    </h3>
                    <div className="divide-y divide-stone">
                      {headlineList.map((item, idx) => (
                        <Link
                          key={item._id}
                          to={`/post/${item.slug}`}
                          className="group flex items-start gap-4 py-4 first:pt-4 last:pb-1"
                        >
                          <span className="font-serif text-2xl font-bold text-gold/80 group-hover:text-burgundy transition-colors leading-none w-7 shrink-0">
                            0{idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                              {item.category || "News"}
                            </span>
                            <h4 className="mt-1 font-serif text-base font-bold text-charcoal group-hover:text-burgundy transition-colors line-clamp-2 leading-snug">
                              {item.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </RevealSection>
              </div>
            </div>
          </section>
        )}

        {/* 5. Latest News Grid */}
        <section className="py-14 md:py-16 bg-ivory border-b border-stone">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <RevealSection>
              <SectionHeading
                kicker="Fresh Off The Desk"
                title="Latest News"
                linkTo="/news"
                linkLabel="View All Articles"
              />
            </RevealSection>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 rounded-sm bg-stone/40 animate-pulse border border-stone"
                  />
                ))}
              </div>
            ) : latestPosts.length > 0 ? (
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {latestPosts.map((post) => (
                  <StaggerItem key={post._id}>
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            ) : (
              <EmptyCategoryState name="Latest News" />
            )}
          </div>
        </section>

        {/* 6. Bollywood Section */}
        <CategoryBand
          kicker="Hindi Cinema"
          title="Bollywood"
          slug="bollywood"
          posts={bollywoodPosts}
          cream
          asymmetric
        />

        {/* 7. Hollywood Section (Dark Cinematic Band) */}
        <CategoryBand
          kicker="Global Cinema"
          title="Hollywood"
          slug="hollywood"
          posts={hollywoodPosts}
          dark
        />

        {/* 8. TV & Television Section */}
        <CategoryBand
          kicker="Small Screen & TRP"
          title="TV & Television"
          slug="television"
          posts={tvPosts}
        />

        {/* 9. Digital Section */}
        <CategoryBand
          kicker="OTT & Streaming"
          title="Digital"
          slug="digital"
          posts={digitalPosts}
          cream
        />

        {/* 10. Movies Section */}
        <CategoryBand
          kicker="Reviews & Box Office"
          title="Movies"
          slug="movies"
          posts={moviesPosts}
        />

        {/* 11. Celebrity Stories */}
        <CategoryBand
          kicker="Profiles & Exclusives"
          title="Celebrity Stories"
          slug="celebrity"
          posts={celebrityStoriesPosts}
          cream
          asymmetric
        />

        {/* 12. Entertainment Videos Section */}
        <section className="bg-charcoal text-ivory py-16 border-y border-soft-black relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(184,58,53,0.14),transparent_55%)]"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
            <RevealSection className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                  <Play className="w-3.5 h-3.5 fill-gold" /> Telly Shine Originals
                </span>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mt-2 text-ivory leading-tight">
                  Entertainment Videos &amp; Celebrity Interviews
                </h2>
                <p className="mt-3 text-ivory/70 text-sm sm:text-base leading-relaxed">
                  Watch exclusive actor interviews, serial promos, red carpet highlights, and
                  behind-the-scenes dispatches on our official YouTube channel.
                </p>
              </div>
              <a
                href="https://youtube.com/@tellyshineofficial456?si=Navejp9tReHUExfa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-sm bg-burgundy hover:bg-burgundy-dark px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] text-ivory shrink-0 transition-colors"
              >
                <Youtube className="w-4 h-4" /> Watch on YouTube
              </a>
            </RevealSection>
          </div>
        </section>

        {/* Newsletter & Official Socials */}
        <section className="bg-ivory-light py-16 border-b border-stone">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <RevealSection>
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-burgundy">
                <Mail className="w-3.5 h-3.5" /> The Morning Dispatch
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-2">
                Subscribe to Our Entertainment Newsletter
              </h2>
              <p className="mt-3 text-sm sm:text-base text-ink-muted max-w-xl mx-auto">
                Curated Bollywood, Hollywood, Television, and OTT stories delivered directly to your inbox.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-7 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 h-11 rounded-sm border border-stone bg-ivory px-4 text-sm text-charcoal placeholder:text-ink-muted/70 focus:outline-none focus:border-charcoal"
                />
                <Button
                  type="submit"
                  disabled={subscribing}
                  className="h-11 bg-charcoal hover:bg-burgundy text-ivory px-6 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
                >
                  {subscribing ? "Subscribing..." : "Subscribe"}
                </Button>
              </form>
              {newsletterStatus && (
                <p className="mt-3 text-sm font-medium text-burgundy">
                  {newsletterStatus}
                </p>
              )}

              <div className="mt-10 pt-8 border-t border-stone flex flex-wrap justify-center gap-3">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-sm bg-ivory border border-stone px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </a>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}

export default Home
