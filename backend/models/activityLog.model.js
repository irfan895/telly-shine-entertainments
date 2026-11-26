import mongoose from "mongoose"

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
    },
    actorId: {
      type: String,
      default: "",
    },
    actorEmail: {
      type: String,
      default: "",
    },
    targetType: {
      type: String,
      default: "",
    },
    targetId: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, collection: "activity_logs" }
)

activityLogSchema.index({ createdAt: -1 })

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema)

export default ActivityLog
