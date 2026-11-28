/**
 * Safely extracts a displayable string from any raw API/RSS/MongoDB value.
 * Handles plain strings, numbers, null/undefined, arrays, and nested XML objects
 * such as { "#text": "...", "@_xmlns:dc": "..." } or { "dc:creator": "..." }.
 * Never uses String(object) so "[object Object]" is never produced.
 */
export const extractSafeText = (value, fallback = "", depth = 0) => {
  if (depth > 5 || value === null || value === undefined) return fallback

  if (typeof value === "string") {
    const trimmed = value.trim()
    return trimmed && trimmed !== "[object Object]" ? trimmed : fallback
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => extractSafeText(item, "", depth + 1))
      .filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : fallback
  }

  if (typeof value === "object") {
    const priorityKeys = [
      "#text",
      "_text",
      "text",
      "__cdata",
      "#cdata-section",
      "dc:creator",
      "name",
      "title",
      "label",
      "value",
      "content",
      "@_href",
      "href",
      "url",
    ]
    for (const key of priorityKeys) {
      if (Object.prototype.hasOwnProperty.call(value, key) && value[key] != null) {
        const extracted = extractSafeText(value[key], "", depth + 1)
        if (extracted) return extracted
      }
    }

    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("@_") || k.startsWith("$")) continue
      const extracted = extractSafeText(v, "", depth + 1)
      if (extracted) return extracted
    }
  }

  return fallback
}

export const normalizeAuthorName = (post) => {
  if (!post) return "Telly Shine Editorial"
  return extractSafeText(
    post.author?.name ?? post.author?.["dc:creator"] ?? post.author ?? post["dc:creator"],
    "Telly Shine Editorial"
  )
}

export const normalizeCategoryName = (post) => {
  if (!post) return "Editorial"
  return extractSafeText(
    post.category ?? post.category_name ?? post.category?.name,
    "Editorial"
  )
}

export const normalizeCategorySlug = (post) => {
  if (!post) return "blog"
  const rawSlug = extractSafeText(post.category_slug, "")
  if (rawSlug) return rawSlug.toLowerCase()
  const catName = normalizeCategoryName(post)
  return catName.toLowerCase().replace(/\s+/g, "-") || "blog"
}

export const normalizeArticle = (raw) => {
  if (!raw || typeof raw !== "object") return null

  const title = extractSafeText(raw.title, "Untitled Story")
  const description = extractSafeText(raw.description ?? raw.excerpt, "")
  const excerpt = extractSafeText(raw.excerpt ?? raw.description, "")
  const content = extractSafeText(raw.content, "")
  const category = normalizeCategoryName(raw)
  const categorySlug = normalizeCategorySlug(raw)
  const authorName = normalizeAuthorName(raw)
  const image = extractSafeText(raw.image ?? raw.featured_image, "")
  const featuredImage = extractSafeText(raw.featured_image ?? raw.image, "")
  const slug = extractSafeText(raw.slug ?? raw._id, "story")
  const sourceUrl = extractSafeText(raw.source_url ?? raw.link, "")
  const status = extractSafeText(raw.status, "published")
  const seoTitle = extractSafeText(raw.seo_title, "")
  const seoDescription = extractSafeText(raw.seo_description, "")
  const publishedAt = extractSafeText(raw.published_at ?? raw.createdAt, "")
  const createdAt = extractSafeText(raw.createdAt ?? raw.published_at, "")
  const updatedAt = extractSafeText(raw.updatedAt ?? raw.createdAt, "")

  const tags = Array.isArray(raw.tags)
    ? raw.tags.map((t) => extractSafeText(t)).filter(Boolean)
    : []

  return {
    ...raw,
    _id: extractSafeText(raw._id ?? raw.article_id ?? slug, slug),
    title,
    slug,
    description,
    excerpt,
    content,
    category,
    category_name: extractSafeText(raw.category_name, category),
    category_slug: categorySlug,
    image,
    featured_image: featuredImage,
    author: {
      ...(typeof raw.author === "object" && raw.author !== null ? raw.author : {}),
      name: authorName,
    },
    tags,
    source_url: sourceUrl,
    status,
    seo_title: seoTitle,
    seo_description: seoDescription,
    published_at: publishedAt,
    createdAt,
    updatedAt,
  }
}

export const normalizeArticles = (list) => {
  if (!Array.isArray(list)) return []
  return list.map(normalizeArticle).filter(Boolean)
}
