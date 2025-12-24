const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type : String, required: true },
    description: { type: String, required: true },
    owner: { type:mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    status: { type: String, enum: ["TODO","INPROGRESS","TESTING", "DELIVERD", "HOLD"],  required: true},
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
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true},
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
