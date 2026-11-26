import express from "express"
import ActivityLog from "../models/activityLog.model.js"
import Category from "../models/category.model.js"
import Comment from "../models/comment.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.get("/stats", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      trendingPosts,
      totalCategories,
      totalComments,
      viewsAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments(),
      Post.countDocuments({ status: { $ne: "draft" } }),
      Post.countDocuments({ status: "draft" }),
      Post.countDocuments({ is_featured: true }),
      Post.countDocuments({ is_trending: true }),
      Category.countDocuments(),
      Comment.countDocuments(),
      Post.aggregate([
        { $group: { _id: null, totalViews: { $sum: { $ifNull: ["$views_count", 0] } } } },
      ]),
    ])

    const totalViews = viewsAgg?.[0]?.totalViews || 0

    res.status(200).json({
      totalUsers,
      totalPosts,
      publishedPosts,
      draftPosts,
      featuredPosts,
      trendingPosts,
      totalCategories,
      totalComments,
      totalViews,
    })
  } catch (error) {
    next(error)
  }
})

router.get("/activity", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 15
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(limit)
    res.status(200).json({ logs })
  } catch (error) {
    next(error)
  }
})

export default router
