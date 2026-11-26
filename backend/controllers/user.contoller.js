import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import { normalizeUser } from "../utils/normalize.js"
import { logActivity } from "../utils/activityLogger.js"

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You can only update your own account!"))
  }

  const updates = {}

  if (req.body.password) {
    if (req.body.password.length < 8) {
      return next(errorHandler(400, "Password must be at least 8 characters"))
    }
    updates.password = bcryptjs.hashSync(req.body.password, 12)
    updates.mustChangePassword = false
  }

  if (req.body.username) {
    const cleanUsername = req.body.username.trim().toLowerCase()
    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return next(
        errorHandler(400, "Username must be between 3 and 30 characters")
      )
    }
    if (cleanUsername.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"))
    }
    if (!cleanUsername.match(/^[a-zA-Z0-9._-]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters, numbers, and ._-")
      )
    }
    updates.username = cleanUsername
    updates.full_name = cleanUsername
  }

  if (req.body.email) {
    updates.email = req.body.email.trim().toLowerCase()
  }

  if (req.body.profilePicture) {
    updates.profilePicture = req.body.profilePicture
    updates.avatar = req.body.profilePicture
  }

  // Never allow regular users or this endpoint to escalate isAdmin/role
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    )

    if (!updatedUser) {
      return next(errorHandler(404, "User not found"))
    }

    res.status(200).json(normalizeUser(updatedUser))
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not authorized to delete this user!"))
  }

  try {
    const targetUser = await User.findById(req.params.userId)
    if (!targetUser) {
      return next(errorHandler(404, "User not found"))
    }

    const normalizedTarget = normalizeUser(targetUser)
    if (normalizedTarget.isAdmin) {
      const adminCount = await User.countDocuments({
        $or: [
          { isAdmin: true },
          { is_admin: true },
          { role: { $in: ["admin", "superadmin"] } },
        ],
      })
      if (adminCount <= 1) {
        return next(
          errorHandler(400, "Cannot delete the last remaining administrator!")
        )
      }
    }

    await User.findByIdAndDelete(req.params.userId)
    await logActivity({
      action: "USER_DELETED",
      actorId: req.user.id,
      targetType: "user",
      targetId: req.params.userId,
      details: normalizedTarget.email || "",
    })
    res.status(200).json({ success: true, message: "User has been deleted!" })
  } catch (error) {
    next(error)
  }
}

export const adminUpdateUser = async (req, res, next) => {
  if (!req.user?.isAdmin) {
    return next(errorHandler(403, "Administrator privileges required"))
  }

  try {
    const target = await User.findById(req.params.userId)
    if (!target) {
      return next(errorHandler(404, "User not found"))
    }

    const normalized = normalizeUser(target)
    const updates = {}

    if (typeof req.body.is_active === "boolean") {
      if (normalized._id === req.user.id && req.body.is_active === false) {
        return next(errorHandler(400, "You cannot deactivate your own account"))
      }
      updates.is_active = req.body.is_active
    }

    if (typeof req.body.isAdmin === "boolean") {
      if (normalized.isAdmin && req.body.isAdmin === false) {
        const adminCount = await User.countDocuments({
          $or: [
            { isAdmin: true },
            { is_admin: true },
            { role: { $in: ["admin", "superadmin"] } },
          ],
        })
        if (adminCount <= 1) {
          return next(errorHandler(400, "Cannot demote the last remaining administrator"))
        }
      }
      updates.isAdmin = req.body.isAdmin
      updates.is_admin = req.body.isAdmin
      updates.role = req.body.isAdmin ? "admin" : "user"
    }

    const updated = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updates },
      { new: true }
    )

    await logActivity({
      action: "USER_UPDATED",
      actorId: req.user.id,
      targetType: "user",
      targetId: req.params.userId,
      details: `${normalized.email} (${JSON.stringify(updates)})`,
    })

    res.status(200).json(normalizeUser(updated))
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .json({ success: true, message: "User has been logged out successfully!" })
  } catch (error) {
    next(error)
  }
}

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      errorHandler(403, "You are not authorized to access this resource!")
    )
  }

  try {
    const startIndex = parseInt(req.query.startIndex, 10) || 0
    const limit = parseInt(req.query.limit, 10) || 12
    const sortDirection = req.query.sort === "asc" ? 1 : -1

    const filter = {}
    if (req.query.searchTerm) {
      const term = req.query.searchTerm.trim()
      filter.$or = [
        { username: { $regex: term, $options: "i" } },
        { full_name: { $regex: term, $options: "i" } },
        { email: { $regex: term, $options: "i" } },
      ]
    }

    const users = await User.find(filter)
      .select("-password -password_hash")
      .sort({ createdAt: sortDirection, created_at: sortDirection })
      .skip(startIndex)
      .limit(limit)

    const totalUsers = await User.countDocuments()

    const now = new Date()
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const lastMonthUsers = await User.countDocuments({
      $or: [
        { createdAt: { $gte: oneMonthAgo } },
        { created_at: { $gte: oneMonthAgo.toISOString() } },
      ],
    })

    res.status(200).json({
      users: users.map(normalizeUser),
      totalUsers,
      lastMonthUsers,
    })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params
    let user = null

    if (mongoose.Types.ObjectId.isValid(userId)) {
      user = await User.findById(userId)
    }
    if (!user) {
      user = await User.findOne({ user_id: userId })
    }

    if (!user) {
      return next(errorHandler(404, "User not found!"))
    }

    res.status(200).json(normalizeUser(user))
  } catch (error) {
    next(error)
  }
}
