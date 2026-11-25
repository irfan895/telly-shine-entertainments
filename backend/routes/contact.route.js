import express from "express"
import { getContactMessages, submitContactMessage } from "../controllers/contact.controller.js"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.post("/", submitContactMessage)
router.get("/", verifyToken, verifyAdmin, getContactMessages)

export default router
