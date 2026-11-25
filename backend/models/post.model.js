import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "Blog",
    },
    category_slug: {
      type: String,
      default: "blog",
      lowercase: true,
    },
    category_name: {
      type: String,
      default: "Blog",
    },
    image: {
      type: String,
      default:
        "https://images.pexels.com/photos/723072/pexels-photo-723072.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    featured_image: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    is_trending: {
      type: Boolean,
      default: false,
    },
    published_at: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.Mixed,
    },
    views_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, strict: false, collection: "articles" }
)

postSchema.index({ status: 1, category_slug: 1, createdAt: -1 })

const Post = mongoose.model("Post", postSchema)

export default Post
