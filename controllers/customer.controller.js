const asynchandler = require("express-async-handler")
const Appointment = require("../models/Appointment")
const razorpay = require("razorpay")
const crypto = require("crypto")
const Plumber = require("../models/Plumber")
const Electrician = require("../models/Electrician")
const sendEmail = require("../utils/email")
const Customer = require("../models/Customer")

// exports.bookPlumber = asynchandler(async (req, res) => {
//     console.log(req.customer)
//     await Appointment.create({ ...req.body, plumber: req.body.plumber, customer: req.customer })
//     res.json({ message: "plumber booking request sent" })
// })
// exports.bookElectrician = asynchandler(async (req, res) => {
//     await Appointment.create({ ...req.body, electrician: req.body.electrician, customer: req.customer })
//     res.json({ message: "electrician booking request sent" })
// })

exports.initiatePayment = asynchandler(async (req, res) => {
    const rz = new razorpay({
        key_id: process.env.RAZORPAY_API_KEY,
        key_secret: process.env.RAZORPAY_SCERET_KEY
    })
    rz.orders.create({
        amount: req.body.amount * 100,
        currency: "INR",
        receipt: Date.now().toString()
    }, (err, order) => {
        if (err) {
            return res.status(400).json({ message: err.message || "unable to process payment" })
        }
        res.json({ message: "payment initiate success", result: order })
    })
})


exports.bookAppointment = asynchandler(async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        plumber, electrician, date
    } = req.body

    const x = crypto.
        createHmac("sha256", process.env.RAZORPAY_SCERET_KEY)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex")

    if (razorpay_signature !== x) {
        return res.status(400).json({ message: "invalid payment" })
    }

    const plumberInfo = await Plumber.findById(plumber)
    const electricianInfo = await Electrician.findById(electrician)
    const info = plumberInfo ? plumberInfo : electricianInfo
    const customerInfo = await Customer.findById(req.customer)

    // send email

    const customerEmail = sendEmail({
        to: customerInfo.email,
        subject: " Your Service booking request confirmation",
        message: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Service booking request confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-footer {
            background-color: #f1f1f1;
            color: #777;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
        .booking-details {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .booking-details th {
            text-align: left;
            padding: 5px;
            background-color: #f2f2f2;
        }
        .booking-details td {
            padding: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Booking Confirmed</h2>
            <p>Thank you for choosing Home-Experts</p>
        </div>
        <div class="email-body">
            <p>Dear ${customerInfo.name},</p>
            <p>We are pleased to inform you that your service booking has been successfully confirmed. Below are your booking details:</p>

            <div class="booking-details">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th>Booking Date</th>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <th>Worker Name</th>
                        <td>${info.name}</td>
                    </tr>
                    <tr>
                        <th>Worker Role</th>
                        <td>${info.role}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>${info.charges}</td>
                    </tr>
                </table>
            </div>

            <p>We look forward to welcoming you to Home-Experts. If you have any questions or require assistance, don't hesitate to contact us.</p>
            <p><a href="[ Website URL]" class="button">Visit Our Website</a></p>
        </div>
        <div class="email-footer">
            <p>contact us: ${info.email}</p>
            <p>Contact Us: ${info.mobile}</p>
        </div>
    </div>
</body>
</html>`
    })


    if (plumberInfo) {
        await sendEmail({
            to: plumberInfo.email,
            subject: " Your Service booking request confirmation",
            message: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Service booking request confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-footer {
            background-color: #f1f1f1;
            color: #777;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
        .booking-details {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .booking-details th {
            text-align: left;
            padding: 5px;
            background-color: #f2f2f2;
        }
        .booking-details td {
            padding: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Booking Confirmed</h2>
            <p>Thank you for choosing Home-Experts</p>
        </div>
        <div class="email-body">
            <p>Dear ${info.name},</p>
            <p>You have a new booking request from a customer. Below are your booking details:</p>

            <div class="booking-details">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th>Booking Date</th>
                        <td>${info.date}</td>
                    </tr>
                    <tr>
                        <th>Customer Name</th>
                        <td>${customerInfo.name}</td>
                    </tr>
                    <tr>
                        <th>Customer Email</th>
                        <td>${customerInfo.email}</td>
                    </tr>
                    <tr>
                        <th>Customer Mobile</th>
                        <td>${customerInfo.mobile}</td>
                    </tr>
                    <tr>
                        <th>Customer Address</th>
                        <td>${customerInfo.address}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>${customerInfo.charges}</td>
                    </tr>
                </table>
            </div>

            <p>If you need any additional information or have questions, please contact the customer directly at the provided email or phone number.</p>
            <p><a href="[ Website URL]" class="button">Visit Our Website</a></p>
        </div>
        <div class="email-footer">
            <p>Thank you for chhosing Home-Experts</p>
        </div>
    </div>
</body>
</html>`
        })
    }
    if (electricianInfo) {
        await sendEmail({
            to: electricianInfo.email,
            subject: " Your Service booking request confirmation",
            message: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Service booking request confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color: #007bff;
            color: #fff;
            padding: 20px;
            text-align: center;
        }
        .email-body {
            padding: 20px;
        }
        .email-footer {
            background-color: #f1f1f1;
            color: #777;
            padding: 10px;
            text-align: center;
            font-size: 12px;
        }
        .booking-details {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .booking-details th {
            text-align: left;
            padding: 5px;
            background-color: #f2f2f2;
        }
        .booking-details td {
            padding: 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 4px;
            text-align: center;
        }
        .button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h2>Booking Confirmed</h2>
            <p>Thank you for choosing Home-Experts</p>
        </div>
        <div class="email-body">
            <p>Dear ${electricianInfo.name},</p>
            <p>You have a new booking request from a customer. Below are your booking details:</p>

            <div class="booking-details">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th>Booking Date</th>
                        <td>${date}</td>
                    </tr>
                    <tr>
                        <th>Customer Name</th>
                        <td>${customerInfo.name}</td>
                    </tr>
                    <tr>
                        <th>Customer Email</th>
                        <td>${customerInfo.email}</td>
                    </tr>
                    <tr>
                        <th>Customer Mobile</th>
                        <td>${customerInfo.mobile}</td>
                    </tr>
                    <tr>
                        <th>Customer Address</th>
                        <td>${customerInfo.address}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>${customerInfo.charges}</td>
                    </tr>
                </table>
            </div>

            <p>If you need any additional information or have questions, please contact the customer directly at the provided email or phone number.</p>
            <p><a href="[ Website URL]" class="button">Visit Our Website</a></p>
        </div>
        <div class="email-footer">
            <p>Thank you for chhosing Home-Experts</p>
        </div>
    </div>
</body>
            </html>`
        })
    }
    await Promise.all([customerEmail])
    // add to database
    await Appointment.create({
        ...req.body,
        plumber: req.body.plumber ? req.body.plumber : null,
        electrician: req.body.electrician ? req.body.electrician : null,
        customer: req.customer
    })
    res.json({ message: "Service Booking request success " })
})