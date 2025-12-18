const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: { type : String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["INPROGRESS", "DONE", "HOLD","TODO"], default: "TODO"},
    priority: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], required: true},
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
    createdBy: { type:mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    projectId: { type:mongoose.Schema.Types.ObjectId, ref:"Project", required: true},
    comments:[
        {
            comment: { type: String, required: true },
            commenterName: { type: String, required: true },
            commenterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
            commentedAt: { type: Date, default: Date.now } }
    ],
    attachments: [
        {
          url: String,
          public_id: String,
        },
      ],
    dueDate: { type: Date}
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
