import express from "express"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js"
import {
  create,
  deletepost,
  getPosts,
  syncNews,
  updatepost,
} from "../controllers/post.controller.js"

const router = express.Router()

router.post("/create", verifyToken, verifyAdmin, create)
router.post("/sync-news", verifyToken, verifyAdmin, syncNews)
router.get("/getposts", getPosts)
router.delete("/deletepost/:postId/:userId", verifyToken, verifyAdmin, deletepost)
router.put("/updatepost/:postId/:userId", verifyToken, verifyAdmin, updatepost)

export default router
