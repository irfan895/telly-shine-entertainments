import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getFallbackImage, handleImageError } from "@/lib/imageFallback"
import { normalizeArticle, normalizeArticles } from "@/lib/rssNormalize"
import {
  EditorialImage,
  PageTransition,
  RevealSection,
  StaggerGrid,
  StaggerItem,
} from "@/components/editorial/MotionPrimitives"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FaFacebook, FaLink, FaWhatsapp } from "react-icons/fa"
import { FaXTwitter } from "react-icons/fa6"
import { Clock, Calendar, ArrowLeft } from "lucide-react"

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

        const loadedPost = normalizeArticle(data.posts[0])
        if (!loadedPost) {
          setError(true)
          setLoading(false)
          return
        }
        setPost(loadedPost)
        setLoading(false)

        document.title = `${loadedPost.seo_title || loadedPost.title} | Telly Shine Entertainment`
        const desc = loadedPost.seo_description || loadedPost.description || loadedPost.excerpt || ""
        const metaDesc = document.querySelector('meta[name="description"]')
        if (metaDesc && desc) metaDesc.setAttribute("content", desc)

        if (loadedPost.category_slug) {
          const relRes = await fetch(
            `/api/post/getposts?category=${encodeURIComponent(loadedPost.category_slug)}&limit=4`
          )
          const relData = await relRes.json()
          if (relRes.ok) {
            setRelatedArticles(
              normalizeArticles(relData.posts || [])
                .filter((p) => p._id !== loadedPost._id)
                .slice(0, 3)
            )
          }
        }
      } catch {
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
          setLatestArticles(normalizeArticles(data.posts || []))
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
      <div className="flex justify-center items-center min-h-screen bg-ivory">
        <div className="h-10 w-10 rounded-full border-2 border-burgundy border-t-transparent animate-spin" />
      </div>
    )
  }

  if (error || !post) {
    return (
      <main className="bg-ivory min-h-screen px-6 py-24 text-center">
        <div className="max-w-xl mx-auto bg-ivory-light border border-stone rounded-sm p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-burgundy">
            Editorial Archive
          </p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-2">
            Article Not Found
          </h1>
          <p className="text-ink-muted mt-3 text-sm leading-relaxed">
            The article you are looking for may have been moved or is not published yet.
          </p>
          <Link to="/" className="inline-block mt-6">
            <Button className="bg-burgundy hover:bg-burgundy-dark text-ivory rounded-sm text-xs uppercase tracking-wider font-semibold px-6">
              Back to Homepage
            </Button>
          </Link>
        </div>
      </main>
    )
  }

  const publishedDate = post.published_at || post.createdAt
  const shareUrl = encodeURIComponent(window.location.href)
  const shareTitle = encodeURIComponent(post.title)
  const readMinutes = Math.max(1, Math.ceil((post.content?.length || 100) / 800))

  return (
    <PageTransition>
      <main className="bg-ivory min-h-screen py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center justify-between text-xs text-ink-muted">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 hover:text-burgundy transition-colors font-medium uppercase tracking-wider"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Edition
            </Link>
            <Link
              to={`/category/${post.category_slug || "blog"}`}
              className="uppercase tracking-[0.18em] font-semibold text-burgundy hover:text-charcoal transition-colors"
            >
              {post.category || post.category_name || "Editorial"}
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Main Editorial Article Column */}
            <article className="lg:col-span-8">
              <header>
                <Link
                  to={`/category/${post.category_slug || "blog"}`}
                  className="inline-block bg-burgundy text-ivory px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-burgundy-dark transition-colors"
                >
                  {post.category || post.category_name}
                </Link>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-[1.12] tracking-tight mt-4">
                  {post.title}
                </h1>

                {(post.description || post.excerpt) && (
                  <p className="mt-5 text-ink-muted text-base sm:text-lg leading-relaxed font-normal">
                    {post.description || post.excerpt}
                  </p>
                )}

                {/* Author, Publication Meta & Social Sharing */}
                <div className="flex flex-wrap items-center justify-between gap-4 mt-6 py-4 border-y border-stone text-xs text-ink-muted">
                  <div className="flex flex-wrap items-center gap-3">
                    {post.author?.name && (
                      <span className="font-semibold text-charcoal uppercase tracking-wider">
                        By {post.author.name}
                      </span>
                    )}
                    {publishedDate && (
                      <>
                        <span className="text-stone">&bull;</span>
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          {new Date(publishedDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </>
                    )}
                    <span className="text-stone">&bull;</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gold" />
                      {readMinutes} min read
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold uppercase tracking-wider text-[10px] text-ink-muted mr-1">
                      Share
                    </span>
                    <a
                      href={`https://api.whatsapp.com/send?text=${shareTitle}%20${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on WhatsApp"
                      className="p-2 rounded-sm border border-stone bg-ivory-light text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <FaWhatsapp size={14} />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${shareTitle}&url=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on X"
                      className="p-2 rounded-sm border border-stone bg-ivory-light text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <FaXTwitter size={14} />
                    </a>
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Share on Facebook"
                      className="p-2 rounded-sm border border-stone bg-ivory-light text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <FaFacebook size={14} />
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      aria-label="Copy link"
                      className="p-2 rounded-sm border border-stone bg-ivory-light text-charcoal hover:border-burgundy hover:text-burgundy transition-colors"
                    >
                      <FaLink size={13} />
                    </button>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="mt-7 rounded-sm overflow-hidden border border-stone shadow-sm">
                <img
                  src={post.image || post.featured_image || getFallbackImage(post.category_slug)}
                  alt={post.title}
                  onError={(e) => handleImageError(e, post.category_slug)}
                  className="max-h-[520px] w-full object-cover"
                />
              </div>

              <Separator className="my-8 bg-stone" />

              {/* Editorial Article Content */}
              <div
                className="post-content max-w-[68ch]"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-10 pt-6 border-t border-stone flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted mr-2">
                    Topics:
                  </span>
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/search?searchTerm=${encodeURIComponent(tag)}`}
                      className="rounded-sm border border-stone bg-ivory-light hover:border-burgundy hover:text-burgundy px-3 py-1 text-xs font-medium text-charcoal transition-colors"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              <div className="mt-10 pt-8 border-t border-stone">
                <CommentSection postId={post._id} articleId={post.article_id} />
              </div>
            </article>

            {/* Editorial Sidebar */}
            <aside className="lg:col-span-4 space-y-6">
              <div className="rounded-sm border border-stone bg-ivory-light p-6 sticky top-20">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-burgundy">
                  In This Issue
                </p>
                <h2 className="font-serif text-xl font-bold text-charcoal mt-1 pb-3 border-b border-stone">
                  Latest Dispatches
                </h2>
                <div className="divide-y divide-stone mt-2">
                  {latestArticles
                    .filter((a) => a._id !== post._id)
                    .slice(0, 5)
                    .map((item) => (
                      <Link
                        key={item._id}
                        to={`/post/${item.slug}`}
                        className="flex gap-3.5 py-3.5 group"
                      >
                        <EditorialImage
                          src={item.image || item.featured_image}
                          alt={item.title}
                          categorySlug={item.category_slug}
                          containerClassName="w-20 h-16 rounded-sm shrink-0 border border-stone"
                          className="group-hover:scale-105"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-burgundy">
                            {item.category}
                          </span>
                          <h3 className="font-serif text-sm font-bold text-charcoal group-hover:text-burgundy line-clamp-2 leading-snug mt-0.5 transition-colors">
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
            <RevealSection className="mt-16 pt-12 border-t border-stone">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-burgundy">
                Continue Reading
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal mt-1 mb-7">
                Related Articles
              </h2>
              <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                {relatedArticles.map((article) => (
                  <StaggerItem key={article._id}>
                    <PostCard post={article} />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </RevealSection>
          )}
        </div>
      </main>
    </PageTransition>
  )
}

export default PostDetails
