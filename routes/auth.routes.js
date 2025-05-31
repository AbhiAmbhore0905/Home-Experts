const { plumberRegister, plumberLogin, plumberLogout, electricianRegister, electricianLogin, electricianLogout, adminRegister, sendOtp, adminLogin, adminLogout, continueWithGoogle, customerLogout } = require("../controllers/auth.controller")

const router = require("express").Router()
router
    .post("/plumber-register", plumberRegister)
    .post("/plumber-login", plumberLogin)
    .post("/plumber-logout", plumberLogout)

    .post("/electrician-register", electricianRegister)
    .post("/electrician-login", electricianLogin)
    .post("/electrician-logout", electricianLogout)

    .post("/admin-register", adminRegister)
    .post("/send-otp", sendOtp)
    .post("/admin-login", adminLogin)
    .post("/admin-logout", adminLogout)

    .post("/continue-with-google", continueWithGoogle)
    .post("/customer-logout", customerLogout)

module.exports = router