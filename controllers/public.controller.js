const asynchandler = require("express-async-handler")
const Plumber = require("../models/Plumber")
const Electrician = require("../models/Electrician")

exports.getAllServices = asynchandler(async (req, res) => {
    // const { search } = req.query
    // const data = {}
    // if (search) {
    //     data.role = { $regex: `^${search}`, $options: "i" }
    // }
    let el = await Electrician.find({ isActive: true, }).select("name photo _id city charges").lean()
    el = el.map(item => {
        return { ...item, role: "electrician" }
    })
    let pl = await Plumber.find({ isActive: true, }).select("name photo _id city charges").lean()
    pl = pl.map(item => {
        return { ...item, role: "plumber" }
    })
    res.json({ message: " fetch all services", result: [...el, ...pl] })
})

exports.getServiceDetails = asynchandler(async (req, res) => {
    const { sid } = req.params
    const elc = await Electrician.findById(sid).select("_id name city photo charges ").lean()
    let plu = await Plumber.findById(req.params.sid).select("_id name photo city charges ").lean()

    res.json({ message: "service detail fetch success", result: [elc ? { ...elc, role: "electrician" } : { ...plu, role: "plumber" }] })
})