const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type : String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["superAdmin", "admin", "employee", "client"] },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    profilePic : { type: String },
    address: {
        city: { type: String },
        state: { type: String },
        pincode: { type: String },
        country: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
