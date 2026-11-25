export const CATEGORY_MAP = {
  blog: { name: "Blog", slug: "blog" },
  television: { name: "Television", slug: "television" },
  digital: { name: "Digital", slug: "digital" },
  "digital-ott": { name: "Digital", slug: "digital" },
  movies: { name: "Movies", slug: "movies" },
  stories: { name: "Stories", slug: "stories" },
  podcasts: { name: "Podcasts", slug: "podcasts" },
}

export const normalizeCategory = (raw) => {
  if (!raw) return { name: "Blog", slug: "blog" }
  const key = String(raw).trim().toLowerCase().replace(/\s*\/\s*ott$/i, "").replace(/\s+/g, "-")
  return CATEGORY_MAP[key] || { name: String(raw).trim(), slug: key }
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
  const created = obj.createdAt || obj.published_at || new Date().toISOString()
  const updated = obj.updatedAt || obj.updated_at || created

  return {
    _id: obj._id?.toString(),
    article_id: obj.article_id || obj._id?.toString(),
    userId: obj.userId || obj.author?.user_id || "",
    title: obj.title,
    slug: obj.slug,
    content: obj.content || "",
    description: obj.description || obj.excerpt || "",
    excerpt: obj.excerpt || obj.description || "",
    category: cat.name,
    category_slug: cat.slug,
    category_name: obj.category_name || cat.name,
    image:
      obj.image ||
      obj.featured_image ||
      "https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600",
    featured_image: obj.featured_image || obj.image || "",
    status: obj.status || "published",
    is_featured: Boolean(obj.is_featured),
    is_trending: Boolean(obj.is_trending),
    author: obj.author || { name: "Telly Shine Editorial" },
    views_count: obj.views_count || 0,
    createdAt: created,
    updatedAt: updated,
    published_at: obj.published_at || created,
  }
}

export const normalizeComment = (doc) => {
  if (!doc) return null
  const obj = typeof doc.toObject === "function" ? doc.toObject() : { ...doc }
  return {
    _id: obj._id?.toString(),
    content: obj.content || obj.comment || "",
    postId: obj.postId || obj.article_id || "",
    article_slug: obj.article_slug || "",
    userId: obj.userId || obj.user_id || "",
    user_name: obj.user_name || "",
    user_avatar: obj.user_avatar || "",
    likes: Array.isArray(obj.likes) ? obj.likes : [],
    numberOfLikes: typeof obj.numberOfLikes === "number" ? obj.numberOfLikes : 0,
    status: obj.status || "approved",
    createdAt: obj.createdAt || obj.created_at || new Date().toISOString(),
    updatedAt: obj.updatedAt || obj.created_at || new Date().toISOString(),
  }
}
