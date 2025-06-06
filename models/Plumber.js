const mongoose = require("mongoose")

module.exports = mongoose.model("plumber", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    gender: { type: String, required: true },
    city: { type: String, required: true },
    photo: { type: String, required: true },
    charges: { type: String, required: true },
    password: { type: String, required: true },

    isActive: { type: Boolean, default: false }
}))