const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Modals = require("../modals/modals");
const User = Modals.User ;
const nodemailer = require('nodemailer');
const otpSend = require("../middeware/nodemailer");

// otp genrate 
var rowOtp = String(new Date().getMilliseconds() + new Date().getMilliseconds() + new Date().getMilliseconds()) + new Date().getMinutes();
var otp = rowOtp.slice(0,4);

router.get("/login", (req, res) => {
    const error = req.session.error ;
    delete req.session.error ;
    const msg = req.session.msg;
    delete  req.session.msg;
    res.render("login",{err: error, msg: msg});
});

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    
    if(validateEmail(email) !== true){
        req.session.error = "Please Enter a Valid Email";
        return res.redirect("/login");
    }
    
    const user = await User.findOne({email: email});

    if (user.otpcheck == false) {
        req.session.error = "Email is not verified";
        return res.redirect("/login")
    }
    
    if (user == null || user == undefined) {
        req.session.error = "Crediansals Invalid";
        return res.redirect("/login")
    }
    bcrypt.compare(password, user.password,(error, info)=> {
        if (error) {
            req.session.error = "Crediansals Invalid";
        
        return res.redirect("/login")
       }else {
        req.session.isAuth = true;
        req.session.user =  user.username;
        req.session.userId = user._id;
        return res.redirect("/");

       }
    })  
});

router.get("/register", (req, res) => {
    const error = req.session.error ;
    delete req.session.error ;
    return res.render('register',{err: error});
});
router.post("/register", async (req, res) => {
    const {username, email, password, cnfpassword} = req.body;
    if(password != cnfpassword){
        req.session.error = "Confirm Password Not Match";
        return res.redirect("/register");
    }
    if(validateEmail(email) !== true){
        req.session.error = "Please Enter a Valid Email";
        return res.redirect("/register")
    }
    if(password.length <= 5){
        req.session.error = "Password Should be 6 charter long";
        return res.redirect("/register");
    }
    await otpSend(email, otp).catch(erro => console.log(erro))
    const hasspass = await bcrypt.hash(password, 10);
    const newuser = new User({
        username: username,
        email: email,
        password: hasspass
    });
    await newuser.save();
    req.session.otpmsg = "OTP hash been send to your Email";
    req.session.email = email;
    // res.redirect("/otpshow")
    res.render("showotp",{email: email, msg: "",otpmsg: "OTP hash been send to your Email" })
    // req.session.msg = "You Have Register Sucsess Fully";
    // res.status(201).redirect("/login")
});
router.get("/otpshow", (req, res) => {
    const otpmsg = req.session.otpmsg ;
    const email = req.session.email;
    delete req.session.otpmsg ;
    delete req.session.email;
    res.render("showotp", {msg: otpmsg, email: email});
})
router.post("/otp", async (req, res) => {
    const {email, uotp} = req.body;
    
    if(otp == uotp && email != undefined) {
        req.session.msg = "You Have Register Sucsess Fully";
        const user = await User.findOne({email: email});
        await User.updateOne({email: email}, { $set: { otpcheck: true}});
        req.session.isAuth = true;
        req.session.user =  user.username;
        req.session.userId = user._id;
        return res.redirect("/");
    }else {
        req.session.errmsg = "Otp not match"
        res.redirect("/otpshow")
    }
});
// logout session 
router.get("/logout", (req, res) => {
    req.session.destroy(function(err) {
        if (err) {
            res.redirect("/userpf")
        }
    })
    res.redirect("/");
})

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
module.exports = router ;