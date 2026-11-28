/**
 * Safely extracts a plain displayable string from any raw RSS/API/MongoDB value.
 * Handles strings, numbers, null/undefined, arrays, and XML parser objects
 * containing #text, @_xmlns:dc, dc:creator, name, value, label, etc.
 * Never returns "[object Object]".
 */
export const extractText = (value, fallback = "", depth = 0) => {
  if (depth > 5 || value === null || value === undefined) return fallback
  if (typeof value === "string") return value.trim() || fallback
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value)) {
    const parts = value
      .map((item) => extractText(item, "", depth + 1))
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
        const extracted = extractText(value[key], "", depth + 1)
        if (extracted) return extracted
      }
    }

    // Fallback: inspect any non-XML-attribute key
    for (const [k, v] of Object.entries(value)) {
      if (k.startsWith("@_") || k.startsWith("$")) continue
      const extracted = extractText(v, "", depth + 1)
      if (extracted) return extracted
    }
  }

  return fallback
}

export const normalizeAuthor = (author) => {
  if (!author) return { name: "Telly Shine Editorial" }
  if (typeof author === "string") {
    return { name: author.trim() || "Telly Shine Editorial" }
  }
  if (typeof author === "object") {
    const name = extractText(
      author.name ?? author["dc:creator"] ?? author["#text"] ?? author,
      "Telly Shine Editorial"
    )
    return {
      ...author,
      name,
      ...(author.user_id ? { user_id: extractText(author.user_id) } : {}),
      ...(author.avatar ? { avatar: extractText(author.avatar) } : {}),
    }
  }
  return { name: "Telly Shine Editorial" }
}

export const CATEGORY_MAP = {
  blog: { name: "Blog", slug: "blog" },
  bollywood: { name: "Bollywood", slug: "bollywood" },
  hollywood: { name: "Hollywood", slug: "hollywood" },
  television: { name: "Television", slug: "television" },
  "tv-television": { name: "Television", slug: "television" },
  digital: { name: "Digital", slug: "digital" },
  "digital-ott": { name: "Digital", slug: "digital" },
  movies: { name: "Movies", slug: "movies" },
  celebrity: { name: "Celebrity News", slug: "celebrity" },
  "celebrity-news": { name: "Celebrity News", slug: "celebrity" },
  stories: { name: "Stories", slug: "stories" },
  podcasts: { name: "Podcasts", slug: "podcasts" },
}

export const normalizeCategory = (raw) => {
  const text = extractText(raw, "")
  if (!text) return { name: "Blog", slug: "blog" }
  const key = text
    .toLowerCase()
    .replace(/\s*\/\s*ott$/i, "")
    .replace(/\s+/g, "-")
  return CATEGORY_MAP[key] || { name: text, slug: key }
}

export const normalizeUser = (doc) => {
  if (!doc) return null
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc }
  const isAdmin = Boolean(
    obj.isAdmin || obj.is_admin || obj.role === "admin" || obj.role === "superadmin"
  )
  return {
    _id: obj._id?.toString(),
    user_id: obj.user_id || obj._id?.toString(),
    username:
      obj.username ||
      obj.full_name ||
      (obj.email ? obj.email.split("@")[0] : "user"),
    full_name: obj.full_name || obj.username || "",
    email: obj.email,
    profilePicture:
      obj.profilePicture ||
      obj.avatar ||
      "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    isAdmin,
    role: obj.role || (isAdmin ? "admin" : "user"),
    is_active: obj.is_active !== false,
    authProvider: obj.authProvider || obj.authentication_provider || "email",
    mustChangePassword: Boolean(obj.mustChangePassword),
    createdAt: obj.createdAt || obj.created_at || new Date().toISOString(),
    updatedAt: obj.updatedAt || obj.updated_at || obj.createdAt || obj.created_at,
  }
}

export const normalizePost = (doc) => {
  if (!doc) return null
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc }
  const cat = normalizeCategory(obj.category_slug || obj.category_name || obj.category)
  const created = extractText(obj.createdAt || obj.published_at, new Date().toISOString())
  const updated = extractText(obj.updatedAt || obj.updated_at, created)
  const title = extractText(obj.title, "Untitled Story")
  const description = extractText(obj.description || obj.excerpt, "")
  const excerpt = extractText(obj.excerpt || obj.description, "")
  const content = extractText(obj.content, "")
  const image = extractText(
    obj.image || obj.featured_image,
    "https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600"
  )
  const featuredImage = extractText(obj.featured_image || obj.image, image)

  return {
    _id: obj._id?.toString(),
    article_id: extractText(obj.article_id) || obj._id?.toString(),
    userId: extractText(obj.userId || obj.author?.user_id, ""),
    title,
    slug: extractText(obj.slug, obj._id?.toString() || "story"),
    content,
    description,
    excerpt,
    category: cat.name,
    category_slug: cat.slug,
    category_name: extractText(obj.category_name, cat.name),
    image,
    featured_image: featuredImage,
    status: extractText(obj.status, "published"),
    is_featured: Boolean(obj.is_featured),
    is_trending: Boolean(obj.is_trending),
    is_breaking: Boolean(obj.is_breaking),
    author: normalizeAuthor(obj.author || obj["dc:creator"]),
    tags: Array.isArray(obj.tags)
      ? obj.tags.map((t) => extractText(t)).filter(Boolean)
      : [],
    seo_title: extractText(obj.seo_title, ""),
    seo_description: extractText(obj.seo_description, ""),
    source_url: extractText(obj.source_url, ""),
    views_count: typeof obj.views_count === "number" ? obj.views_count : 0,
    createdAt: created,
    updatedAt: updated,
    published_at: extractText(obj.published_at, created),
  }
}

export const normalizeComment = (doc) => {
  if (!doc) return null
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc }
  return {
    _id: obj._id?.toString(),
    content: extractText(obj.content || obj.comment, ""),
    postId: extractText(obj.postId || obj.article_id, ""),
    article_slug: extractText(obj.article_slug, ""),
    userId: extractText(obj.userId || obj.user_id, ""),
    user_name: extractText(obj.user_name, ""),
    user_avatar: extractText(obj.user_avatar, ""),
    likes: Array.isArray(obj.likes) ? obj.likes : [],
    numberOfLikes: typeof obj.numberOfLikes === "number" ? obj.numberOfLikes : 0,
    status: extractText(obj.status, "approved"),
    createdAt: extractText(obj.createdAt || obj.created_at, new Date().toISOString()),
    updatedAt: extractText(obj.updatedAt || obj.created_at, new Date().toISOString()),
  }
}
