const asynchandler = require("express-async-handler")
const Plumber = require("../models/Plumber")
const Electrician = require("../models/Electrician")
const Appointment = require("../models/Appointment")
const Customer = require("../models/Customer")

exports.fetchAllPlumber = asynchandler(async (req, res) => {
    const result = await Plumber.find()
    res.json({ message: "fetch plumber success", result })
})

exports.fetchAllElectrician = asynchandler(async (req, res) => {
    const result = await Electrician.find()
    res.json({ message: "fetch electrician success", result })
})

exports.fetchAllCustomer = asynchandler(async (req, res) => {
    const result = await Customer.find()
    res.json({ message: "fetch customer success", result })
})

exports.fetchCustomerBookings = asynchandler(async (req, res) => {
    const result = await Appointment.find()
    res.json({ message: "fetch customer success", result })
})

exports.blockUnblockPlumber = asynchandler(async (req, res) => {
    await Plumber.findByIdAndUpdate(req.params.pid, { isActive: req.body.isActive })
    res.json({ message: "Plumber account update " })
})

exports.blockUnblockElectrician = asynchandler(async (req, res) => {
    const result = await Electrician.findByIdAndUpdate(req.params.cid, { isActive: req.body.isActive })
    res.json({ message: "Electrician account update ", result })
})

exports.blockUnblockCustomer = asynchandler(async (req, res) => {
    const result = await Customer.findByIdAndUpdate(req.params.did, { isActive: req.body.isActive })
    res.json({ message: "Customer account update ", result })
})