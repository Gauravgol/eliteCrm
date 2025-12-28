const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
    role: { type : String, required: true },
    menu:[]
}, { timestamps: true });

module.exports = mongoose.model("menu", menuSchema,"menu");
