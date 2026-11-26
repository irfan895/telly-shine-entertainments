import React from "react"
import { Link } from "react-router-dom"
import { getFallbackImage, handleImageError } from "@/lib/imageFallback"

const PostCard = ({ post }) => {
  const dateValue = post.published_at || post.createdAt
  const formattedDate = dateValue
    ? new Date(dateValue).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : ""
  const shortDesc = post.description || post.excerpt || ""

  return (
    <article className="bg-white hover:shadow-lg transition-shadow overflow-hidden rounded-xl border border-gray-200 flex flex-col h-full">
      <Link
        to={`/post/${post.slug}`}
        className="block h-52 w-full overflow-hidden bg-gray-100"
      >
        <img
          src={post.image || post.featured_image || getFallbackImage(post.category_slug)}
          alt={post.title}
          onError={(e) => handleImageError(e, post.category_slug)}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </Link>

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between text-xs">
          <Link
            to={`/category/${post.category_slug || "blog"}`}
            className="font-bold uppercase tracking-wider text-red-600 hover:underline"
          >
            {post.category || post.category_name || "Blog"}
          </Link>
          {formattedDate && (
            <span className="text-slate-500">{formattedDate}</span>
          )}
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="text-lg font-bold leading-snug line-clamp-2 text-slate-900 hover:text-red-600 transition-colors">
            {post.title}
          </h3>
        </Link>

        {shortDesc && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {shortDesc}
          </p>
        )}

        <div className="mt-auto pt-3">
          <Link
            to={`/post/${post.slug}`}
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:text-red-700 hover:underline"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard
