import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { normalizeArticles } from "@/lib/rssNormalize"
import {
  PageTransition,
  StaggerGrid,
  StaggerItem,
} from "@/components/editorial/MotionPrimitives"

const CATEGORY_LABELS = {
  bollywood: {
    title: "Bollywood",
    subtitle: "Bollywood film news, box office updates, trailers, and celebrity scoops.",
  },
  hollywood: {
    title: "Hollywood",
    subtitle: "Hollywood premieres, global cinema, awards, and international star news.",
  },
  blog: {
    title: "Editorial Blog",
    subtitle: "Editorial opinions, deep dives, and commentary from Telly Shine Entertainment.",
  },
  television: {
    title: "TV & Television",
    subtitle: "Daily soap updates, TRP charts, casting news, and exclusive TV interviews.",
  },
  digital: {
    title: "Digital & OTT",
    subtitle: "OTT releases, web series reviews, streaming trends, and digital creators.",
  },
  movies: {
    title: "Movies",
    subtitle: "Box office reports, trailers, film reviews, and cinema updates.",
  },
  celebrity: {
    title: "Celebrity News",
    subtitle: "Celebrity interviews, red carpet moments, and trending star stories.",
  },
  stories: {
    title: "Celebrity Stories",
    subtitle: "Feature stories, celebrity profiles, and behind-the-scenes narratives.",
  },
  podcasts: {
    title: "Podcasts",
    subtitle: "Conversations, audio episodes, and unfiltered chats with your favorite stars.",
  },
}

const CategoryPage = () => {
  const { slug } = useParams()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMore, setShowMore] = useState(false)

  const info = CATEGORY_LABELS[slug?.toLowerCase()] || {
    title: slug || "Articles",
    subtitle: "Browse the latest published stories on Telly Shine Entertainment.",
  }

  useEffect(() => {
    document.title = `${info.title} | Telly Shine Entertainment`
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/post/getposts?category=${encodeURIComponent(slug)}&limit=9`
        )
        const data = await res.json()
        if (res.ok) {
          const list = normalizeArticles(data.posts || [])
          setPosts(list)
          setShowMore(list.length === 9)
        }
      } catch (error) {
        console.error("Failed to fetch category posts:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCategoryPosts()
  }, [slug])

  const handleShowMore = async () => {
    try {
      const res = await fetch(
        `/api/post/getposts?category=${encodeURIComponent(slug)}&startIndex=${posts.length}&limit=9`
      )
      const data = await res.json()
      if (res.ok) {
        const nextPosts = normalizeArticles(data.posts || [])
        setPosts((prev) => [...prev, ...nextPosts])
        setShowMore(nextPosts.length === 9)
      }
    } catch (error) {
      console.error("Failed to load more posts:", error)
    }
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-ivory">
        <section className="bg-charcoal text-ivory border-b border-soft-black py-12 md:py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Telly Shine Section
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-ivory mt-2">
              {info.title}
            </h1>
            <p className="text-ivory/70 mt-3 max-w-2xl text-sm sm:text-base leading-relaxed">
              {info.subtitle}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-sm bg-stone/40 animate-pulse border border-stone"
                />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="rounded-sm border border-dashed border-stone bg-ivory-light p-12 text-center text-ink-muted text-sm">
              No published articles found in {info.title} yet. Check back soon!
            </div>
          ) : (
            <>
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {posts.map((post) => (
                  <StaggerItem key={post._id}>
                    <PostCard post={post} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
              {showMore && (
                <div className="mt-12 text-center">
                  <Button
                    variant="outline"
                    onClick={handleShowMore}
                    className="border-charcoal text-charcoal hover:bg-charcoal hover:text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-7 h-10"
                  >
                    Load More Articles
                  </Button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    </PageTransition>
  )
}

export default CategoryPage
