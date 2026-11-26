import crypto from "crypto"
import bcryptjs from "bcryptjs"
import User from "../models/user.model.js"

export const initializeAdminAccount = async () => {
  const rawEmail = process.env.ADMIN_EMAIL
  const rawPassword = process.env.ADMIN_PASSWORD

  if (!rawEmail || !rawPassword) {
    console.error(
      "Admin initialization skipped: ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment variables."
    )
    return
  }

  if (rawPassword.length < 8) {
    console.error(
      "Admin initialization skipped: ADMIN_PASSWORD must be at least 8 characters."
    )
    return
  }

  const email = rawEmail.trim().toLowerCase()

  try {
    const existing = await User.findOne({ email })
    if (existing) {
      // Preserve existing password; only ensure admin privileges & active status
      if (!existing.isAdmin || !existing.is_admin || existing.role !== "admin" || existing.is_active === false) {
        existing.isAdmin = true
        existing.is_admin = true
        existing.role = "admin"
        existing.is_active = true
        if (!existing.user_id) {
          existing.user_id = crypto.randomUUID().replace(/-/g, "")
        }
        await existing.save()
        console.log("Verified existing administrator privileges.")
      }
      return
    }

    const passwordHash = await bcryptjs.hash(rawPassword, 12)
    const baseUsername =
      email.split("@")[0].replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 18) ||
      "tellyadmin"

    await User.create({
      user_id: crypto.randomUUID().replace(/-/g, ""),
      username: `${baseUsername}${Date.now().toString().slice(-4)}`,
      full_name: "Telly Shine Admin",
      email,
      password: passwordHash,
      isAdmin: true,
      is_admin: true,
      role: "admin",
      is_active: true,
      mustChangePassword: false,
      authProvider: "email",
    })

    console.log("Initial administrator account created.")
  } catch (error) {
    console.error("Admin initialization error:", error.message)
  }
}
