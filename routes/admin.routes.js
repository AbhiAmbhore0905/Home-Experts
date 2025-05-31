const { fetchAllPlumber, fetchAllElectrician, fetchCustomerBookings, fetchAllCustomer, blockUnblockPlumber, blockUnblockElectrician, blockUnblockCustomer } = require("../controllers/admin.controller")

const router = require("express").Router()
router

    .get("/fetch-plumber", fetchAllPlumber)
    .get("/fetch-electrician", fetchAllElectrician)
    .get("/fetch-customer", fetchAllCustomer)
    .get("/fetch-bookings", fetchCustomerBookings)

    .patch("/plumber-update/:pid", blockUnblockPlumber)
    .patch("/electrician-update/:cid", blockUnblockElectrician)
    .patch("/customer-update/:did", blockUnblockCustomer)

module.exports = router