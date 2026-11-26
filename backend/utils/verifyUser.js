import { errorHandler } from "./error.js"
import jwt from "jsonwebtoken"

export const extractToken = (req) => {
  if (req.cookies?.access_token) return req.cookies.access_token
  const authHeader = req.headers?.authorization || ""
  if (authHeader.startsWith("Bearer ")) {
    return authHeader.slice(7).trim()
  }
  return null
}

export const verifyToken = (req, res, next) => {
  const token = extractToken(req)

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
