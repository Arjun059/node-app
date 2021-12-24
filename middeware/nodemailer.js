require('dotenv').config({path: '../.env'})
const nodemailer = require("nodemailer");
async function otpcheck (userEmail, otp) {
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: String(process.env.email),
        pass: String(process.env.emailpass)
    }
})
const info = await transporter.sendMail({
    from: "nodeap.herokuapp@gmail.com",
    to : userEmail,
    subject: "OTP FROM NODE-APP",
    // text: "your otp is "+ otp,
    html: "<h2>Wellcome to node-app </h2> <br> <p>It's a blog website. Feel Free to write Blog</p> <h2>Your OTP :" +otp+ "</h2>"
}) 
console.log(info)

}
module.exports = otpcheck;
// otpcheck("colol@gmail.com", "1234").catch(err => console.log(err))
// module.exports = otpcheck ;

