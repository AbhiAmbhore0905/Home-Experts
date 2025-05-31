const { bookPlumber, bookElectrician, bookAppointment, initiatePayment } = require("../controllers/customer.controller")

const router = require("express").Router()
router
    // .post("/book-plumber", bookPlumber)
    // .post("/book-electrician", bookElectrician)
    .post("/book-appointment", bookAppointment)
    .post("/initiate-payment", initiatePayment)

module.exports = router