const asynchandler = require("express-async-handler")
const jwt = require("jsonwebtoken");
const Plumber = require("../models/Plumber");
const Electrician = require("../models/Electrician");
const Customer = require("../models/Customer");

exports.plumberProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.PLUMBER
    console.log("cookies", req.cookies);

    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWY_KEY, async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        const result = await Plumber.findById(data._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "account block by admin" })
        }
        req.customer = data._id
        next()

    })
})

exports.electricianProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.ELECTRICIAN
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env, JWT_KEY, async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }
        const result = await Electrician.findById(data._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "account block by admin" })
        }
        req.customer = data._id
        next()
    })
})

exports.customerProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.CUSTOMER
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, async (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid cookie" })
        }
        const result = await Customer.findById(data._id)
        if (!result.isActive) {
            return res.status(401).json({ message: "account block by admin" })
        }

        req.customer = data._id
        next()
    })
})

exports.adminProtected = asynchandler(async (req, res, next) => {
    const token = req.cookies.ADMIN
    if (!token) {
        return res.status(401).json({ message: "no cookie found" })
    }
    jwt.verify(token, process.env.JWT_KEY, (err, data) => {
        if (err) {
            console.log(err)
            return res.status(401).json({ message: "invalid token" })
        }

        req.customer = data._id
        next()
    })
})    