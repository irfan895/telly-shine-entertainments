import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"

const CATEGORY_LABELS = {
  blog: {
    title: "Blog",
    subtitle: "Editorial opinions, deep dives, and commentary from Telly Shine Entertainment.",
  },
  television: {
    title: "Television",
    subtitle: "Daily soap updates, TRP charts, casting news, and exclusive TV interviews.",
  },
  digital: {
    title: "Digital",
    subtitle: "OTT releases, web series reviews, streaming trends, and digital creators.",
  },
  movies: {
    title: "Movies",
    subtitle: "Box office reports, trailers, film reviews, and cinema updates.",
  },
  stories: {
    title: "Stories",
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
    const fetchCategoryPosts = async () => {
      try {
        setLoading(true)
        const res = await fetch(
          `/api/post/getposts?category=${encodeURIComponent(slug)}&limit=9`
        )
        const data = await res.json()
        if (res.ok) {
          setPosts(data.posts || [])
          setShowMore((data.posts || []).length === 9)
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
        const nextPosts = data.posts || []
        setPosts((prev) => [...prev, ...nextPosts])
        setShowMore(nextPosts.length === 9)
      }
    } catch (error) {
      console.error("Failed to load more posts:", error)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-gray-100 border-b border-gray-200 py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600">
            Telly Shine Entertainment
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 mt-2">
            {info.title}
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">{info.subtitle}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded-xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-slate-500">
            No published articles found in {info.title} yet. Check back soon!
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            {showMore && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  onClick={handleShowMore}
                  className="border-slate-300 hover:border-red-600 hover:text-red-600"
                >
                  Load More Articles
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default CategoryPage
