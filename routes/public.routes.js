const { getAllServices, getServiceDetails } = require("../controllers/public.controller")

const router = require("express").Router()
router
    .get("/all-services", getAllServices)
    .get("/get-service-detail/:sid", getServiceDetails)

module.exports = router