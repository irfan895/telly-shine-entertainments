import mongoose from "mongoose"

const newsletterSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    status: {
      type: String,
      default: "subscribed",
    },
  },
  { timestamps: true, strict: false, collection: "newsletter" }
)

const Newsletter = mongoose.model("Newsletter", newsletterSchema)

export default Newsletter
