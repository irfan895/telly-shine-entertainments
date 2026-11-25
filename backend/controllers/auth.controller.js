import crypto from "crypto"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import { verifyFirebaseIdToken } from "../utils/firebaseAdmin.js"
import { normalizeUser } from "../utils/normalize.js"

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
})

const signAuthToken = (user) => {
  const normalized = normalizeUser(user)
  return jwt.sign(
    { id: normalized._id, isAdmin: normalized.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )
}

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password || !username.trim() || !email.trim()) {
      return next(errorHandler(400, "All fields are required"))
    }

    if (password.length < 8) {
      return next(
        errorHandler(400, "Password must be at least 8 characters long")
      )
    }

    const cleanEmail = email.trim().toLowerCase()
    const cleanUsername = username.trim()

    const existingEmail = await User.findOne({ email: cleanEmail })
    if (existingEmail) {
      return next(
        errorHandler(409, "An account with this email already exists")
      )
    }

    const existingUsername = await User.findOne({ username: cleanUsername })
    if (existingUsername) {
      return next(errorHandler(409, "This username is already taken"))
    }

    const hashedPassword = bcryptjs.hashSync(password, 12)

    const newUser = new User({
      user_id: crypto.randomUUID().replace(/-/g, ""),
      username: cleanUsername,
      full_name: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      isAdmin: false,
      is_admin: false,
      role: "user",
      authProvider: "email",
    })

    await newUser.save()
    res.status(201).json({ success: true, message: "Signup successful" })
  } catch (error) {
    next(error)
  }
}

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password || !email.trim()) {
      return next(errorHandler(400, "Email and password are required"))
    }

    const cleanEmail = email.trim().toLowerCase()
    const validUser = await User.findOne({ email: cleanEmail })

    if (!validUser) {
      return next(errorHandler(404, "Invalid email or password"))
    }

    const storedHash = validUser.password || validUser.password_hash
    if (!storedHash) {
      return next(
        errorHandler(
          400,
          "This account uses Google Sign-In. Please continue with Google."
        )
      )
    }

    const validPassword = bcryptjs.compareSync(password, storedHash)
    if (!validPassword) {
      return next(errorHandler(400, "Invalid email or password"))
    }

    const token = signAuthToken(validUser)
    const userPayload = normalizeUser(validUser)

    res
      .status(200)
      .cookie("access_token", token, getCookieOptions())
      .json(userPayload)
  } catch (error) {
    next(error)
  }
}

export const adminSignin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password || !email.trim()) {
      return next(errorHandler(400, "Email and password are required"))
    }

    const cleanEmail = email.trim().toLowerCase()
    const validUser = await User.findOne({ email: cleanEmail })

    if (!validUser) {
      return next(errorHandler(401, "Invalid administrator credentials"))
    }

    const storedHash = validUser.password || validUser.password_hash
    if (!storedHash || !bcryptjs.compareSync(password, storedHash)) {
      return next(errorHandler(401, "Invalid administrator credentials"))
    }

    const userPayload = normalizeUser(validUser)
    if (!userPayload.isAdmin) {
      return next(
        errorHandler(403, "Access denied: Administrator privileges required")
      )
    }

    const token = signAuthToken(validUser)

    res
      .status(200)
      .cookie("access_token", token, getCookieOptions())
      .json(userPayload)
  } catch (error) {
    next(error)
  }
}

export const google = async (req, res, next) => {
  try {
    const { idToken } = req.body

    if (!idToken) {
      return next(errorHandler(400, "Firebase ID token is required"))
    }

    let decodedToken
    try {
      decodedToken = await verifyFirebaseIdToken(idToken)
    } catch (verifyErr) {
      return next(
        errorHandler(401, "Invalid or expired Google authentication token")
      )
    }

    const email = decodedToken.email?.trim().toLowerCase()
    if (!email) {
      return next(
        errorHandler(400, "Google account did not provide a verified email")
      )
    }

    let user = await User.findOne({ email })

    if (!user) {
      const displayName = decodedToken.name || email.split("@")[0]
      const baseUsername =
        displayName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 14) ||
        "user"
      const generatedPassword =
        Math.random().toString(36).slice(-10) +
        Math.random().toString(36).slice(-10)

      user = new User({
        user_id: crypto.randomUUID().replace(/-/g, ""),
        username: `${baseUsername}${Math.floor(1000 + Math.random() * 9000)}`,
        full_name: displayName,
        email,
        password: bcryptjs.hashSync(generatedPassword, 12),
        profilePicture:
          decodedToken.picture ||
          "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
        firebaseUid: decodedToken.uid,
        authProvider: "google",
        isAdmin: false, // Never grant admin through Google login
        is_admin: false,
        role: "user",
      })

      await user.save()
    } else if (!user.firebaseUid) {
      user.firebaseUid = decodedToken.uid
      await user.save()
    }

    const token = signAuthToken(user)
    const userPayload = normalizeUser(user)

    return res
      .status(200)
      .cookie("access_token", token, getCookieOptions())
      .json(userPayload)
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) {
      return next(errorHandler(404, "User not found"))
    }
    res.status(200).json(normalizeUser(user))
  } catch (error) {
    next(error)
  }
}
