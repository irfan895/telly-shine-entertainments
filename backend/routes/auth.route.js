import express from "express"
import {
  adminSignin,
  forgotPassword,
  getMe,
  google,
  resetPassword,
  signin,
  signup,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/admin/signin", adminSignin)
router.post("/google", google)
router.post("/forgot-password", forgotPassword)
router.post("/reset-password", resetPassword)
router.get("/me", verifyToken, getMe)

export default router
