import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return next(errorHandler(401, "Unauthorized: Please sign in to continue"))
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHandler(401, "Unauthorized: Invalid or expired session"))
    }

    req.user = user
    next()
  })
}

export const verifyAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return next(
      errorHandler(403, "Forbidden: Administrator privileges required")
    )
  }
  next()
}
