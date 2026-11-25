import Advertise from "@/components/shared/Advertise"
import CommentSection from "@/components/shared/CommentSection"
import PostCard from "@/components/shared/PostCard"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

const PostDetails = () => {
  const { postSlug } = useParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [post, setPost] = useState(null)
  const [recentArticles, setRecentArticles] = useState([])

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

        setPost(data.posts[0])
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    fetchPost()
  }, [postSlug])

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?limit=3`)
        const data = await res.json()
        if (res.ok) {
          setRecentArticles(data.posts || [])
        }
      } catch (err) {
        console.error(err.message)
      }
    }
    fetchRecentPosts()
  }, [])

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

  return (
    <main className="px-4 sm:px-6 py-8 flex flex-col max-w-5xl mx-auto min-h-screen bg-white">
      <Link
        to={`/category/${post.category_slug || "blog"}`}
        className="self-center"
      >
        <Button
          variant="outline"
          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-xs uppercase tracking-wider font-bold"
        >
          {post.category || post.category_name}
        </Button>
      </Link>

      <h1 className="text-3xl md:text-5xl mt-5 text-center font-black max-w-4xl mx-auto text-slate-950 leading-tight">
        {post.title}
      </h1>

      {(post.description || post.excerpt) && (
        <p className="mt-4 text-center text-slate-600 max-w-3xl mx-auto text-base md:text-lg">
          {post.description || post.excerpt}
        </p>
      )}

      <div className="flex justify-center items-center gap-4 mt-5 text-xs text-slate-500">
        {post.author?.name && <span>By {post.author.name}</span>}
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

      <img
        src={post.image || post.featured_image}
        alt={post.title}
        className="mt-8 rounded-2xl max-h-[520px] w-full object-cover shadow-md"
      />

      <Separator className="my-8 bg-gray-200" />

      <div
        className="max-w-3xl mx-auto w-full post-content prose prose-slate lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="max-w-4xl mx-auto w-full my-8">
        <Advertise />
      </div>

      <CommentSection postId={post._id} articleId={post.article_id} />

      <div className="mt-12">
        <h2 className="text-2xl font-black text-slate-950 mb-6 text-center">
          Recently Published Articles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentArticles.map((article) => (
            <PostCard key={article._id} post={article} />
          ))}
        </div>
      </div>
    </main>
  )
}

export default PostDetails
