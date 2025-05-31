const multer = require("multer")


const plumberPhotoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")
const electricianPhotoUpload = multer({ storage: multer.diskStorage({}) }).single("photo")

module.exports = { plumberPhotoUpload, electricianPhotoUpload }