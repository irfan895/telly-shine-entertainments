import React from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { EditorialImage } from "@/components/editorial/MotionPrimitives"
import { normalizeArticle } from "@/lib/rssNormalize"

const PostCard = ({ post: rawPost, variant = "default" }) => {
  const post = normalizeArticle(rawPost)
  if (!post) return null

  const dateValue = post.published_at || post.createdAt
  const parsedDate = dateValue ? new Date(dateValue) : null
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : ""
  const shortDesc = post.description || post.excerpt || ""
  const categoryLabel = post.category || post.category_name || "Editorial"
  const categorySlug = post.category_slug || "blog"
  const imageSrc = post.image || post.featured_image
  const isDark = variant === "dark"

  if (variant === "compact") {
    return (
      <article className="group flex gap-4 items-start py-4 border-b border-stone last:border-b-0">
        <Link
          to={`/post/${post.slug}`}
          className="w-24 h-20 shrink-0 rounded-sm overflow-hidden border border-stone"
        >
          <EditorialImage
            src={imageSrc}
            alt={post.title}
            categorySlug={categorySlug}
            containerClassName="w-full h-full"
            className="group-hover:scale-105"
          />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em]">
            <Link
              to={`/category/${categorySlug}`}
              className="text-burgundy hover:text-gold transition-colors"
            >
              {categoryLabel}
            </Link>
            {formattedDate && (
              <>
                <span className="text-stone">&bull;</span>
                <span className="text-ink-muted">{formattedDate}</span>
              </>
            )}
          </div>
          <Link to={`/post/${post.slug}`}>
            <h3 className="mt-1 font-serif text-base font-bold leading-snug text-charcoal group-hover:text-burgundy transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
        </div>
      </article>
    )
  }

  if (variant === "featured") {
    return (
      <article className="group bg-ivory-light border border-stone rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_36px_-14px_rgba(23,23,23,0.18)]">
        <Link to={`/post/${post.slug}`} className="block">
          <EditorialImage
            src={imageSrc}
            alt={post.title}
            categorySlug={categorySlug}
            containerClassName="h-64 md:h-80 w-full"
            className="group-hover:scale-[1.03]"
          />
        </Link>

        <div className="p-6 md:p-7 flex flex-col flex-1">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.16em]">
            <Link
              to={`/category/${categorySlug}`}
              className="inline-block px-2.5 py-1 bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-ivory transition-colors duration-300 rounded-sm"
            >
              {categoryLabel}
            </Link>
            {formattedDate && (
              <span className="text-ink-muted font-medium">{formattedDate}</span>
            )}
          </div>

          <Link to={`/post/${post.slug}`} className="mt-4 block">
            <h3 className="font-serif text-2xl md:text-[1.75rem] font-bold leading-tight text-charcoal group-hover:text-burgundy transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          {shortDesc && (
            <p className="mt-3 text-sm md:text-[15px] text-ink-muted line-clamp-3 leading-relaxed">
              {shortDesc}
            </p>
          )}

          <div className="mt-auto pt-5 border-t border-stone/70 flex items-center justify-between text-xs">
            <span className="text-ink-muted font-medium">
              {post.author?.name ? `By ${post.author.name}` : "Telly Shine Desk"}
            </span>
            <Link
              to={`/post/${post.slug}`}
              className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-burgundy group-hover:text-charcoal transition-colors"
            >
              Read Story <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={`group rounded-sm overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-0.5 ${isDark
          ? "bg-soft-black border border-ivory/15 hover:border-gold/50 hover:shadow-[0_16px_36px_-14px_rgba(0,0,0,0.6)]"
          : "bg-ivory-light border border-stone hover:border-charcoal/30 hover:shadow-[0_14px_34px_-14px_rgba(23,23,23,0.16)]"
        }`}
    >
      <Link to={`/post/${post.slug}`} className="block">
        <EditorialImage
          src={imageSrc}
          alt={post.title}
          categorySlug={categorySlug}
          dark={isDark}
          containerClassName="h-52 w-full"
          className="group-hover:scale-[1.04]"
        />
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-[0.16em]">
          <Link
            to={`/category/${categorySlug}`}
            className={`px-2 py-0.5 rounded-sm transition-colors duration-300 ${isDark
                ? "bg-gold/15 text-gold group-hover:bg-gold group-hover:text-charcoal"
                : "bg-burgundy/10 text-burgundy group-hover:bg-burgundy group-hover:text-ivory"
              }`}
          >
            {categoryLabel}
          </Link>
          {formattedDate && (
            <span className={isDark ? "text-ivory/55" : "text-ink-muted"}>
              {formattedDate}
            </span>
          )}
        </div>

        <Link to={`/post/${post.slug}`} className="mt-3 block">
          <h3
            className={`font-serif text-lg md:text-xl font-bold leading-snug line-clamp-2 transition-colors ${isDark
                ? "text-ivory group-hover:text-gold"
                : "text-charcoal group-hover:text-burgundy"
              }`}
          >
            {post.title}
          </h3>
        </Link>

        {shortDesc && (
          <p
            className={`mt-2.5 text-sm line-clamp-2 leading-relaxed ${isDark ? "text-ivory/65" : "text-ink-muted"
              }`}
          >
            {shortDesc}
          </p>
        )}

        <div
          className={`mt-auto pt-4 flex items-center justify-between text-xs border-t ${isDark ? "border-ivory/10" : "border-stone/70"
            }`}
        >
          <span className={isDark ? "text-ivory/55" : "text-ink-muted"}>
            {post.author?.name || "Editorial Desk"}
          </span>
          <Link
            to={`/post/${post.slug}`}
            className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider transition-colors ${isDark
                ? "text-gold hover:text-ivory"
                : "text-burgundy hover:text-charcoal"
              }`}
          >
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export default PostCard
