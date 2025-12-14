const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    name: { type : String, required: true },
    description: { type: String, required: true },
    owner: { type: String, required: true },
    status: { type: String, enum: ["INPROGRESS", "DONE", "HOLD"],  required: true},
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true}
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
