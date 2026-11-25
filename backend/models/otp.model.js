import mongoose from "mongoose"

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, collection: "otps" }
)

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const Otp = mongoose.model("Otp", otpSchema)

export default Otp
