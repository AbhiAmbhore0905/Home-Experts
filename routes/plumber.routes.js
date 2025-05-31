const { fetchAllBookings } = require("../controllers/plumber.controller")

const router = require("express").Router()
router
    .get("/fetchallbooking", fetchAllBookings)

module.exports = router    