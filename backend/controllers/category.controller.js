import Category from "../models/category.model.js"
import { errorHandler } from "../utils/error.js"
import { logActivity } from "../utils/activityLogger.js"

const DEFAULT_CATEGORIES = [
  { name: "Bollywood", slug: "bollywood", description: "Bollywood film news, box office, and celebrity updates.", order: 1 },
  { name: "Hollywood", slug: "hollywood", description: "Hollywood premieres, global cinema, and star interviews.", order: 2 },
  { name: "Television", slug: "television", description: "TV & Television serials, TRP charts, and showbiz updates.", order: 3 },
  { name: "Digital", slug: "digital", description: "OTT platforms, web series, and digital entertainment.", order: 4 },
  { name: "Movies", slug: "movies", description: "Movie reviews, trailers, and theatrical releases.", order: 5 },
  { name: "Celebrity News", slug: "celebrity", description: "Celebrity interviews, red carpets, and trending moments.", order: 6 },
  { name: "Stories", slug: "stories", description: "In-depth entertainment stories and editorial features.", order: 7 },
  { name: "Blog", slug: "blog", description: "Editorial blogs, opinions, and commentary.", order: 8 },
]

const toSlug = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ order: 1, name: 1 })
    if (categories.length === 0) {
      return res.status(200).json({ categories: DEFAULT_CATEGORIES })
    }
    res.status(200).json({ categories })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, order } = req.body
    if (!name || !name.trim()) {
      return next(errorHandler(400, "Category name is required"))
    }

    const slug = toSlug(name)
    const existing = await Category.findOne({ slug })
    if (existing) {
      return next(errorHandler(409, "Category already exists"))
    }

    const created = await Category.create({
      name: name.trim(),
      slug,
      description: (description || "").trim(),
      order: typeof order === "number" ? order : 10,
    })

    await logActivity({
      action: "CATEGORY_CREATED",
      actorId: req.user.id,
      targetType: "category",
      targetId: created._id,
      details: created.name,
    })

    res.status(201).json({ category: created })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, order } = req.body
    if (!name || !name.trim()) {
      return next(errorHandler(400, "Category name is required"))
    }

    const updates = {
      name: name.trim(),
      slug: toSlug(name),
      description: (description || "").trim(),
    }
    if (typeof order === "number") updates.order = order

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    )
    if (!updated) {
      return next(errorHandler(404, "Category not found"))
    }

    await logActivity({
      action: "CATEGORY_UPDATED",
      actorId: req.user.id,
      targetType: "category",
      targetId: updated._id,
      details: updated.name,
    })

    res.status(200).json({ category: updated })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return next(errorHandler(404, "Category not found"))
    }

    await logActivity({
      action: "CATEGORY_DELETED",
      actorId: req.user.id,
      targetType: "category",
      targetId: req.params.id,
      details: deleted.name || "",
    })

    res.status(200).json({ success: true, message: "Category deleted" })
  } catch (error) {
    next(error)
  }
}
