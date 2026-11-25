import express from "express"
import {
  adminSignin,
  getMe,
  google,
  signin,
  signup,
} from "../controllers/auth.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/admin/signin", adminSignin)
router.post("/google", google)
router.get("/me", verifyToken, getMe)

export default router
