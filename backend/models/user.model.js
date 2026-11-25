import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    full_name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    password_hash: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
    },
    avatar: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    firebaseUid: {
      type: String,
    },
    authProvider: {
      type: String,
      default: "email",
    },
  },
  { timestamps: true, strict: false, collection: "users" }
)

userSchema.index({ createdAt: -1 })

const User = mongoose.model("User", userSchema)

export default User
