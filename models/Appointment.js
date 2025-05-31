const mongoose = require("mongoose")

module.exports = mongoose.model("appointment", new mongoose.Schema({
    customer: { type: mongoose.Types.ObjectId, ref: "customer", required: true },
    plumber: { type: mongoose.Types.ObjectId, ref: "plumber", },
    electrician: { type: mongoose.Types.ObjectId, ref: "electrician", },
    date: { type: Date, required: true },
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
}, { timestamps: true })) 