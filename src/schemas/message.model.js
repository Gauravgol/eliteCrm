const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, required: true },
      receiverId: { type: mongoose.Schema.Types.ObjectId, required: true },
      roomId: { type: String, required: true },
      message: { type: String, required: true, trim: true },
      seen: { type: Boolean,default: false },
    },
    { timestamps: true }
  );
module.exports = mongoose.model("message", messageSchema);
