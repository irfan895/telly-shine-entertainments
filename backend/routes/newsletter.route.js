import express from "express"
import Newsletter from "../models/newsletter.model.js"
import { errorHandler } from "../utils/error.js"

const router = express.Router()

router.post("/subscribe", async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email || !email.trim() || !email.includes("@")) {
      return next(errorHandler(400, "Please enter a valid email address"))
    }

    const cleanEmail = email.trim().toLowerCase()
    const existing = await Newsletter.findOne({ email: cleanEmail })
    if (existing) {
      return res.status(200).json({
        success: true,
        message: "You are already subscribed to Telly Shine Entertainment!",
      })
    }

    await Newsletter.create({ email: cleanEmail, status: "subscribed" })
    res.status(201).json({
      success: true,
      message: "Subscribed! You will receive our latest entertainment updates.",
    })
  } catch (error) {
    next(error)
  }
})

export default router
