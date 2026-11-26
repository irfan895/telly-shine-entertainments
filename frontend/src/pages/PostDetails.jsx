import Advertise from "@/components/shared/Advertise"
import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getFallbackImage, handleImageError } from "@/lib/imageFallback"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FaFacebook, FaLink, FaWhatsapp } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"

const PostDetails = () => {
  const { postSlug } = useParams()
  const { toast } = useToast()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [relatedArticles, setRelatedArticles] = useState([])
  const [latestArticles, setLatestArticles] = useState([])

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(false)

        const res = await fetch(`/api/post/getposts?slug=${encodeURIComponent(postSlug)}`)
        const data = await res.json()

        if (!res.ok || !data.posts?.length) {
          setError(true)
          setLoading(false)
          return
        }

        const loadedPost = data.posts[0]
        setPost(loadedPost)
        setLoading(false)

        document.title = `${loadedPost.title} | Telly Shine Entertainment`
        const desc = loadedPost.description || loadedPost.excerpt || ""
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc && desc) metaDesc.setAttribute("content", desc)

        if (loadedPost.category_slug) {
          const relRes = await fetch(
            `/api/post/getposts?category=${encodeURIComponent(loadedPost.category_slug)}&limit=4`
          )
          const relData = await relRes.json()
          if (relRes.ok) {
            setRelatedArticles(
              (relData.posts || []).filter((p) => p._id !== loadedPost._id).slice(0, 3)
            )
          }
        }
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    fetchPost()
  }, [postSlug])

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=5`)
        const data = await res.json()
        if (res.ok) {
          setLatestArticles(data.posts || [])
        }
      } catch (err) {
        console.error(err.message)
      }
    }
    fetchLatestPosts()
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: "Article link copied!" })
    } catch {
      toast({ title: "Copy failed", description: window.location.href })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-red-600 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-20 text-center min-h-screen">
        <h1 className="text-3xl font-bold text-slate-900">Article Not Found</h1>
        <p className="text-slate-600 mt-3">
          The article you are looking for may have been moved or is not published yet.
        </p>
        <Link to="/" className="inline-block mt-6">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Back to Homepage
          </Button>
        </Link>
      </main>
    )
  }

  const publishedDate = post.published_at || post.createdAt
  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post.title)

  return (
    <main className="px-4 sm:px-6 py-8 max-w-7xl mx-auto min-h-screen bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Article Column */}
        <article className="lg:col-span-2">
          <Link to={`/category/${post.category_slug || "blog"}`}>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-xs uppercase tracking-wider font-bold"
            >
              {post.category || post.category_name}
            </Button>
          </Link>

          <h1 className="text-3xl md:text-4xl lg:text-5xl mt-4 font-black text-slate-950 leading-tight">
            {post.title}
          </h1>

          {(post.description || post.excerpt) && (
            <p className="mt-4 text-slate-600 text-base md:text-lg leading-relaxed">
              {post.description || post.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4 mt-5 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              {post.author?.name && <span className="font-semibold text-slate-700">By {post.author.name}</span>}
              <span>•</span>
              <span>
                {publishedDate &&
                  new Date(publishedDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
              </span>
              <span>•</span>
              <span>{Math.max(1, Math.ceil((post.content?.length || 100) / 800))} min read</span>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600 mr-1">Share:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
                className="p-2 rounded-full bg-gray-100 text-green-600 hover:bg-green-100 transition-colors"
              >
                <FaWhatsapp size={15} />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
                className="p-2 rounded-full bg-gray-100 text-slate-900 hover:bg-gray-200 transition-colors"
              >
                <FaXTwitter size={15} />
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
                className="p-2 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <FaFacebook size={15} />
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Copy link"
                className="p-2 rounded-full bg-gray-100 text-slate-700 hover:bg-gray-200 transition-colors"
              >
                <FaLink size={14} />
              </button>
            </div>
          </div>

          <img
            src={post.image || post.featured_image || getFallbackImage(post.category_slug)}
            alt={post.title}
            onError={(e) => handleImageError(e, post.category_slug)}
            className="mt-6 rounded-2xl max-h-[500px] w-full object-cover shadow-md"
          />

          <Separator className="my-8 bg-gray-200" />

          <div
            className="post-content prose prose-slate lg:prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-1">
                Tags:
              </span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?searchTerm=${encodeURIComponent(tag)}`}
                  className="rounded-full bg-gray-100 hover:bg-red-50 hover:text-red-600 px-3 py-1 text-xs font-medium text-slate-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          <div className="my-8">
            <Advertise />
          </div>

          <CommentSection postId={post._id} articleId={post.article_id} />
        </article>

        {/* Latest News Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 sticky top-24">
            <h2 className="text-lg font-black text-slate-950 border-l-4 border-red-600 pl-3 mb-4">
              Latest News
            </h2>
            <div className="space-y-4">
              {latestArticles
                .filter((a) => a._id !== post._id)
                .slice(0, 5)
                .map((item) => (
                  <Link
                    key={item._id}
                    to={`/post/${item.slug}`}
                    className="flex gap-3 group"
                  >
                    <img
                      src={item.image || item.featured_image}
                      alt={item.title}
                      className="w-20 h-16 rounded-lg object-cover shrink-0 bg-gray-200"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-red-600">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mt-14 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-black text-slate-950 mb-6">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedArticles.map((article) => (
              <PostCard key={article._id} post={article} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}

export default PostDetails
