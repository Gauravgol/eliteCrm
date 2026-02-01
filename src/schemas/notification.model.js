const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String,
      enum: [
        "PROJECT_ASSIGNED",
        "TASK_ASSIGNED",
        "TASK_UPDATED",
        "PROJECT_UPDATED",
        "COMMENT_ADDED",
      ], required: true },

    title: { type: String, required: true },
    message: { type: String, required: true },
    entityType: { type: String, enum: ["PROJECT", "TASK"] },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    isRead: { type: Boolean, default: false },
    metadata: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
