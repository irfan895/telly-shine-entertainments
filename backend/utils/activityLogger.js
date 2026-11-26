import ActivityLog from "../models/activityLog.model.js"

export const logActivity = async ({
  action,
  actorId = "",
  actorEmail = "",
  targetType = "",
  targetId = "",
  details = "",
}) => {
  try {
    await ActivityLog.create({
      action,
      actorId: String(actorId || ""),
      actorEmail: String(actorEmail || ""),
      targetType,
      targetId: String(targetId || ""),
      details,
    })
  } catch (err) {
    console.warn("Activity log write failed:", err.message)
  }
}
