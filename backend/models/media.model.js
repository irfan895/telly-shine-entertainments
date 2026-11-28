import mongoose from "mongoose"

const mediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      default: "image",
    },
    contentType: {
      type: String,
      required: true,
    },
    data: {
      type: Buffer,
      required: true,
    },
    uploadedBy: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "media" }
)

const Media = mongoose.model("Media", mediaSchema)

export default Media
