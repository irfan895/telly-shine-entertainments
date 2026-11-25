import mongoose from "mongoose"

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    comment: {
      type: String,
    },
    postId: {
      type: String,
    },
    article_id: {
      type: String,
    },
    userId: {
      type: String,
    },
    user_id: {
      type: String,
    },
    user_name: {
      type: String,
    },
    user_avatar: {
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      default: "approved",
    },
  },
  { timestamps: true, strict: false, collection: "comments" }
)

commentSchema.index({ postId: 1, createdAt: -1 })
commentSchema.index({ article_id: 1 })

const Comment = mongoose.model("Comment", commentSchema)

export default Comment
