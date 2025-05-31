const mongoose = require("mongoose")

module.exports = mongoose.model("customer", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    picture: { type: String, required: true },

    isActive: { type: Boolean, default: false }
}))