import crypto from "crypto"
import dotenv from "dotenv"
import mongoose from "mongoose"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"

dotenv.config()

const run = async () => {
  const { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env
  if (!MONGO_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set MONGO_URI, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env before running admin:setup."
    )
  }
  if (ADMIN_PASSWORD.length < 8) {
    throw new Error(
      "For security, ADMIN_PASSWORD must be at least 8 characters."
    )
  }

  await mongoose.connect(MONGO_URI)
  const email = ADMIN_EMAIL.trim().toLowerCase()
  const password = await bcryptjs.hash(ADMIN_PASSWORD, 12)
  const username = (
    email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase() || "tellyadmin"
  ).slice(0, 20)

  const existing = await User.findOne({ email })
  if (existing) {
    if (!existing.user_id) existing.user_id = crypto.randomUUID().replace(/-/g, "")
    existing.password = password
    existing.isAdmin = true
    existing.is_admin = true
    existing.role = "admin"
    existing.mustChangePassword = true
    await existing.save()
    console.log(`Updated existing account and granted admin access: ${email}`)
  } else {
    await User.create({
      user_id: crypto.randomUUID().replace(/-/g, ""),
      username: `${username}${Date.now().toString().slice(-4)}`,
      full_name: "Telly Shine Admin",
      email,
      password,
      isAdmin: true,
      is_admin: true,
      role: "admin",
      mustChangePassword: true,
      authProvider: "email",
    })
    console.log(`Created administrator account: ${email}`)
  }

  await mongoose.disconnect()
}

run().catch(async (error) => {
  console.error("Admin setup failed:", error.message)
  try {
    await mongoose.disconnect()
  } catch { }
  process.exit(1)
})
