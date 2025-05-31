const asynchandler = require("express-async-handler")
const Customer = require("../models/Customer")

exports.fetchAllBookings = asynchandler(async (req, res) => {
    const result = await Customer.find()
    res.json({ message: " fetch all bookings", result })
})