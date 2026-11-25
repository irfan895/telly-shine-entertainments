import express from "express"
import { createCategory, deleteCategory, getCategories } from "../controllers/category.controller.js"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.get("/", getCategories)
router.post("/", verifyToken, verifyAdmin, createCategory)
router.delete("/:id", verifyToken, verifyAdmin, deleteCategory)

export default router
