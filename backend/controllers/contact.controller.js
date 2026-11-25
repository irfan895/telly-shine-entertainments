import ContactMessage from "../models/contact.model.js"
import { errorHandler } from "../utils/error.js"

export const submitContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return next(errorHandler(400, "Name, email, and message are required"))
    }

    const created = await ContactMessage.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: (subject || "General Inquiry").trim(),
      message: message.trim(),
      status: "unread",
    })

    res.status(201).json({
      success: true,
      message: "Thank you for contacting Telly Shine Entertainment. We have received your message.",
      data: created,
    })
  } catch (error) {
    next(error)
  }
}

export const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(50)
    res.status(200).json({ messages })
  } catch (error) {
    next(error)
  }
}
