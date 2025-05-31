const asynchandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloud = require("./../utils/cloudinary")
const Plumber = require("../models/Plumber")
const { plumberPhotoUpload, electricianPhotoUpload } = require("../utils/upload")
const Electrician = require("../models/Electrician")
const { OAuth2Client } = require("google-auth-library")

const { differenceInSeconds } = require("date-fns")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")
const Customer = require("../models/Customer")

exports.plumberRegister = asynchandler(async (req, res) => {
    plumberPhotoUpload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                message: "unable to upload",
                error: err.message
            })
        }
        const result = await Plumber.findOne({
            $or: [
                { email: req.body.email },
                { mobile: req.body.mobile }
            ]
        })
        if (result) {
            return res.status(401).json({ message: "email / mobile already exist" })
        }
        const { secure_url } = await cloud.uploader.upload(req.file.path)
        const hash = await bcrypt.hash(req.body.password, 10)
        await Plumber.create({ ...req.body, password: hash, photo: secure_url })
        res.json({ message: " plumber register success" })
    })
})


exports.plumberLogin = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await Plumber.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "email / mobile does not exist" })
    }
    const verify = await bcrypt.compare(req.body.password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "invalid password" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("PLUMBER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "plumber login success", result: {
            name: result.name,
            photo: result.photo,
            isActive: result.isActive,
        }
    })
})

exports.plumberLogout = asynchandler(async (req, res) => {
    res.clearCookie("PLUMBER")
    res.json({ message: " plumber logout success" })
})

exports.electricianRegister = asynchandler(async (req, res) => {
    electricianPhotoUpload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({
                message: "unable to upload",
                error: err.message
            })
        }
        const result = await Electrician.findOne({
            $or: [
                { email: req.body.email },
                { mobile: req.body.mobile }
            ]
        })
        if (result) {
            return res.status(401).json({ message: "email / mobile already exist" })
        }
        const { secure_url } = await cloud.uploader.upload(req.file.path)
        const hash = await bcrypt.hash(req.body.password, 10)
        await Electrician.create({ ...req.body, password: hash, photo: secure_url })
        res.json({ message: " electrician register success" })
    })
})

exports.electricianLogin = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await Electrician.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "email / mobile does not exist" })
    }
    const verify = bcrypt.compare(req.body.password, result.password)
    if (!verify) {
        return res.status(401).json({ message: "invalid password" })
    }
    const token = jwt.sign({ _id: result._id, name: result.name }, process.env.JWT_KEY)
    res.cookie("ELECTRICIAN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: " electrician login success", result: {
            name: result.name,
            photo: result.photo,
            isActive: result.isActive
        }
    })
})

exports.electricianLogout = asynchandler(async (req, res) => {
    res.clearCookie("ELECTRICIAN")
    res.json({ message: " electrician logout success" })
})

exports.adminRegister = asynchandler(async (req, res) => {
    await Admin.create(req.body)
    res.json({ message: "admin register success" })
})

exports.sendOtp = asynchandler(async (req, res) => {
    const { username } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)
    await sendEmail({
        to: result.email,
        subject: "login otp",
        message: `your login otp is ${otp} `
    })
    await Admin.findByIdAndUpdate(result._id, { otp, otpSendOn: new Date() })
    res.json({ message: "otp send success" })
})

exports.adminLogin = asynchandler(async (req, res) => {
    const { username, otp } = req.body
    const result = await Admin.findOne({
        $or: [
            { email: username },
            { mobile: username }
        ]
    })
    if (!result) {
        return res.status(401).json({ message: "invalid email / mobile" })
    }
    if (result.otp != otp) {
        return res.status(401).json({ message: " invalid otp " })
    }
    if (differenceInSeconds(new Date(), result.otpSendOn) > 60) {
        return res.status(401).json({ message: " otp expired" })
    }
    await Admin.findByIdAndUpdate(result._id, { otp: null })
    const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
    res.cookie("ADMIN", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
    res.json({
        message: "admin login success", result: {
            name: result.name,
            email: result.email,
            mobile: result.mobile,
        }
    })
})

exports.adminLogout = asynchandler(async (req, res) => {
    res.clearCookie("ADMIN")
    res.json({ message: "admin logout success" })
})

exports.continueWithGoogle = asynchandler(async (req, res) => {
    const { credential } = req.body
    const client = new OAuth2Client({ clientid: process.env.GOOGLE_CLIENT_ID })
    const googleData = await client.verifyIdToken({ idToken: credential })
    const { email, name, picture } = googleData.payload

    const result = await Customer.findOne({ email })
    if (result) {
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY)
        res.cookie("CUSTOMER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
        res.json({
            message: "customer login success", result: {
                email: result.email,
                name: result.name,
                picture: result.picture
            }
        })
    } else {
        const userData = await Customer.create({ email, name, picture })
        const token = jwt.sign({ _id: userData._id }, process.env.JWT_KEY)
        res.cookie("CUSTOMER", token, { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false })
        res.json({
            message: "customer register success", userData: {
                email: userData.email,
                name: userData.name,
                picture: userData.picture
            }
        })
    }
})

exports.customerLogout = asynchandler(async (req, res) => {
    res.clearCookie("CUSTOMER")
    res.json({ message: "customer logout success" })
})