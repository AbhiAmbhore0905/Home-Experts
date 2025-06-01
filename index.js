const express = require("express")
const mongoose = require('mongoose')
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { customerProtected, plumberProtected, adminProtected } = require("./middlewares/auth.middleware")
require("dotenv").config()
const path = require("path")

const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: " https://home-experts.onrender.com",
    credentials: true
}))

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/admin", adminProtected, require("./routes/admin.routes"))
app.use("/api/public", require("./routes/public.routes"))
app.use("/api/customer", customerProtected, require("./routes/customer.routes"))
app.use("/api/plumber", plumberProtected, require("./routes/plumber.routes"))

app.use("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"))
    // res.status(404).json({ message: "resource not found" })
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: "server error", error: err.message })
    next()
})

mongoose.connect(process.env.MONGO_URL)
mongoose.connection.once("open", () => {
    console.log("mongo connected")
    app.listen(process.env.PORT, console.log("server running"))

})

