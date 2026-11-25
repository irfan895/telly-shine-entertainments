import express from "express"
import {
  deleteUser,
  getUserById,
  getUsers,
  signout,
  updateUser,
} from "../controllers/user.contoller.js"
import { verifyAdmin, verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.put("/update/:userId", verifyToken, updateUser)
router.delete("/delete/:userId", verifyToken, deleteUser)
router.post("/signout", signout)
router.get("/getusers", verifyToken, verifyAdmin, getUsers)
router.get("/:userId", getUserById)

export default router
