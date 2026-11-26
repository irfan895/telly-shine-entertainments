import crypto from "crypto"
import jwt from "jsonwebtoken"
import sanitizeHtml from "sanitize-html"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import { normalizeCategory, normalizePost, normalizeUser } from "../utils/normalize.js"
import { syncEntertainmentNews } from "../utils/newsAggregator.js"
import { logActivity } from "../utils/activityLogger.js"

const SANITIZE_OPTIONS = {
  allowedTags: [
    "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "strong", "b", "em", "i", "u", "s", "blockquote",
    "ul", "ol", "li", "a", "br", "hr", "span", "img", "pre", "code",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    span: ["class"],
    p: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
}

const buildUniqueSlug = async (title, excludeId = null) => {
  const baseSlug =
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || `article-${Date.now()}`

  const query = excludeId ? { slug: baseSlug, _id: { $ne: excludeId } } : { slug: baseSlug }
  const existing = await Post.findOne(query)
  if (!existing) return baseSlug
  return `${baseSlug}-${Date.now().toString().slice(-5)}`
}

const isAuthenticatedAdmin = (req) => {
  const token = req.cookies?.access_token
  if (!token) return false
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return Boolean(decoded?.isAdmin)
  } catch {
    return false
  }
}

export const create = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "You are not authorized to create a post!"))
  }

  const { title, content, category, image, description, status, is_featured, is_trending, is_breaking, tags, seo_title, seo_description } = req.body

  if (!title || !title.trim() || !content || !content.trim()) {
    return next(errorHandler(400, "Article title and content are required!"))
  }

  try {
    const cleanContent = sanitizeHtml(content, SANITIZE_OPTIONS)
    const slug = await buildUniqueSlug(title)
    const cat = normalizeCategory(category)
    const articleStatus = status === "draft" ? "draft" : "published"
    const nowIso = new Date().toISOString()

    const authorDoc = await User.findById(req.user.id)
    const authorUser = authorDoc ? normalizeUser(authorDoc) : null

    const newPost = new Post({
      article_id: crypto.randomUUID().replace(/-/g, ""),
      userId: req.user.id,
      title: title.trim(),
      description: (description || "").trim(),
      excerpt: (description || "").trim(),
      category: cat.name,
      category_slug: cat.slug,
      category_name: cat.name,
      image: image || undefined,
      featured_image: image || undefined,
      content: cleanContent,
      slug,
      status: articleStatus,
      is_featured: Boolean(is_featured),
      is_trending: Boolean(is_trending),
      is_breaking: Boolean(is_breaking),
      seo_title: (seo_title || "").trim(),
      seo_description: (seo_description || "").trim(),
      tags: Array.isArray(tags)
        ? tags.map((t) => String(t).trim()).filter(Boolean)
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      published_at: articleStatus === "published" ? nowIso : null,
      author: authorUser
        ? { name: authorUser.full_name || authorUser.username, user_id: authorUser._id, avatar: authorUser.profilePicture }
        : { name: "Telly Shine Editorial" },
    })

    const savedPost = await newPost.save()
    await logActivity({
      action: articleStatus === "published" ? "ARTICLE_PUBLISHED" : "ARTICLE_DRAFT_CREATED",
      actorId: req.user.id,
      targetType: "article",
      targetId: savedPost._id,
      details: savedPost.title,
    })
    res.status(201).json(normalizePost(savedPost))
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const existingCount = await Post.countDocuments({ status: { $ne: "draft" } })
    if (existingCount === 0) {
      await syncEntertainmentNews({ force: true })
    } else {
      syncEntertainmentNews().catch(() => {})
    }

    const startIndex = parseInt(req.query.startIndex, 10) || 0
    const limit = parseInt(req.query.limit, 10) || 12
    const sortDirection = req.query.sort === "asc" ? 1 : -1
    const adminViewer = isAuthenticatedAdmin(req)

    const filter = {}

    // Drafts are strictly private to authenticated admins
    if (!adminViewer || req.query.includeDrafts !== "true") {
      filter.status = { $ne: "draft" }
    } else if (req.query.status && ["published", "draft"].includes(req.query.status)) {
      filter.status = req.query.status
    }

    if (req.query.userId) {
      filter.$and = filter.$and || []
      filter.$and.push({
        $or: [
          { userId: req.query.userId },
          { "author.user_id": req.query.userId },
        ],
      })
    }

    if (req.query.category) {
      const rawCat = req.query.category.trim().toLowerCase()
      const categorySlugs = rawCat === "digital" ? ["digital", "digital-ott"] : [rawCat]
      filter.$and = filter.$and || []
      filter.$and.push({
        $or: [
          { category_slug: { $in: categorySlugs } },
          { category: { $regex: `^${rawCat}$`, $options: "i" } },
          { category_name: { $regex: `^${rawCat}`, $options: "i" } },
        ],
      })
    }

    if (req.query.slug) filter.slug = req.query.slug
    if (req.query.postId) filter._id = req.query.postId
    if (req.query.featured === "true") filter.is_featured = true
    if (req.query.trending === "true") filter.is_trending = true
    if (req.query.breaking === "true") filter.is_breaking = true

    if (req.query.searchTerm) {
      const term = req.query.searchTerm.trim()
      filter.$and = filter.$and || []
      filter.$and.push({
        $or: [
          { title: { $regex: term, $options: "i" } },
          { content: { $regex: term, $options: "i" } },
          { description: { $regex: term, $options: "i" } },
          { excerpt: { $regex: term, $options: "i" } },
          { category_name: { $regex: term, $options: "i" } },
        ],
      })
    }

    const posts = await Post.find(filter)
      .sort({ published_at: sortDirection, createdAt: sortDirection, updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalPosts = await Post.countDocuments()
    const publishedPosts = await Post.countDocuments({ status: { $ne: "draft" } })
    const draftPosts = await Post.countDocuments({ status: "draft" })

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const lastMonthPosts = await Post.countDocuments({
      $or: [
        { createdAt: { $gte: oneMonthAgo } },
        { published_at: { $gte: oneMonthAgo.toISOString() } },
      ],
    })

    if (req.query.slug && posts.length === 1) {
      Post.updateOne({ _id: posts[0]._id }, { $inc: { views_count: 1 } }).catch(() => {})
    }

    res.status(200).json({
      posts: posts.map(normalizePost),
      totalPosts,
      publishedPosts,
      draftPosts,
      lastMonthPosts,
    })
  } catch (error) {
    next(error)
  }
}

export const deletepost = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "You are not authorized to delete this post!"))
  }

  try {
    const deleted = await Post.findByIdAndDelete(req.params.postId)
    if (!deleted) {
      return next(errorHandler(404, "Article not found"))
    }
    await logActivity({
      action: "ARTICLE_DELETED",
      actorId: req.user.id,
      targetType: "article",
      targetId: req.params.postId,
      details: deleted.title || "",
    })

    res.status(200).json({ success: true, message: "Article has been deleted!" })
  } catch (error) {
    next(error)
  }
}

export const updatepost = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "You are not authorized to update this post!"))
  }

  try {
    const existing = await Post.findById(req.params.postId)
    if (!existing) {
      return next(errorHandler(404, "Article not found"))
    }

    const updates = {}
    if (req.body.title !== undefined) {
      updates.title = req.body.title.trim()
    }
    if (req.body.content !== undefined) {
      updates.content = sanitizeHtml(req.body.content, SANITIZE_OPTIONS)
    }
    if (req.body.description !== undefined) {
      updates.description = req.body.description.trim()
      updates.excerpt = req.body.description.trim()
    }
    if (req.body.category !== undefined) {
      const cat = normalizeCategory(req.body.category)
      updates.category = cat.name
      updates.category_slug = cat.slug
      updates.category_name = cat.name
    }
    if (req.body.image !== undefined) {
      updates.image = req.body.image
      updates.featured_image = req.body.image
    }
    if (req.body.status !== undefined && ["published", "draft"].includes(req.body.status)) {
      updates.status = req.body.status
      if (req.body.status === "published" && !existing.published_at) {
        updates.published_at = new Date().toISOString()
      }
    }
    if (req.body.is_featured !== undefined) updates.is_featured = Boolean(req.body.is_featured)
    if (req.body.is_trending !== undefined) updates.is_trending = Boolean(req.body.is_trending)
    if (req.body.is_breaking !== undefined) updates.is_breaking = Boolean(req.body.is_breaking)
    if (req.body.seo_title !== undefined) updates.seo_title = String(req.body.seo_title).trim()
    if (req.body.seo_description !== undefined) updates.seo_description = String(req.body.seo_description).trim()
    if (req.body.tags !== undefined) {
      updates.tags = Array.isArray(req.body.tags)
        ? req.body.tags.map((t) => String(t).trim()).filter(Boolean)
        : typeof req.body.tags === "string"
        ? req.body.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : []
    }
    updates.updated_at = new Date().toISOString()

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { $set: updates },
      { new: true }
    )

    await logActivity({
      action: "ARTICLE_UPDATED",
      actorId: req.user.id,
      targetType: "article",
      targetId: req.params.postId,
      details: updatedPost.title,
    })

    res.status(200).json(normalizePost(updatedPost))
  } catch (error) {
    next(error)
  }
}

export const syncNews = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "Administrator privileges required"))
  }
  try {
    const result = await syncEntertainmentNews({ force: true })
    if (req.query.slug && posts.length === 1) {
      Post.updateOne({ _id: posts[0]._id }, { $inc: { views_count: 1 } }).catch(() => {})
    }

    res.status(200).json({ success: true, ...result })
  } catch (error) {
    next(error)
  }
}
