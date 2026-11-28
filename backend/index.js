import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import commentRoutes from "./routes/comment.route.js"
import contactRoutes from "./routes/contact.route.js"
import categoryRoutes from "./routes/category.route.js"
import adminRoutes from "./routes/admin.route.js"
import newsletterRoutes from "./routes/newsletter.route.js"
import { syncEntertainmentNews } from "./utils/newsAggregator.js"
import { initializeAdminAccount } from "./utils/initAdmin.js"

dotenv.config()

if (!process.env.MONGO_URI) {
  console.error("FATAL: MONGO_URI is not defined in backend/.env")
  process.exit(1)
}

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is not defined in backend/.env")
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 5000

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

app.set("trust proxy", 1)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(new Error("Not allowed by CORS"))
    },
    credentials: true,
  })
)
app.use(express.json({ limit: "8mb" }))
app.use(cookieParser())

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many authentication attempts. Please try again later.",
  },
})

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    brand: "Telly Shine Entertainment",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  })
})

app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/post", postRoutes)
app.use("/api/comment", commentRoutes)
app.use("/api/contact", contactRoutes)
app.use("/api/category", categoryRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/newsletter", newsletterRoutes)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  })
})

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected to telly_shine_db")
    await initializeAdminAccount()
    syncEntertainmentNews().catch((e) => console.warn("Initial news sync:", e.message))
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Telly Shine Entertainment API running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message)
    process.exit(1)
  })
