const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const Modals = require("../modals/modals");
const User = Modals.User ;

router.get("/login", (req, res) => {
    const error = req.session.error ;
    delete req.session.error ;
    res.render("login",{err: error});
})
router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    if(email == "" || password == "") {
        req.session.error = "Fill All Data";
        return res.redirect(403, "/login");
    }
    const user = await User.findOne({email: email});
    if (user == null || user == "") {
        req.session.error = "Crediansals Invalid" ;
        return res.redirect(403, "/login")
    }
    const isfine = await bcrypt.compare(password, user.password);
    if(isfine == false){
        req.session.error = "Crediansals Invalid"
        return res.redirect(403, "/login")
    };
    if(isfine == true){
        req.session.isAuth = true;
        req.session.user =  user.username;
        console.log("req hit")
        return res.redirect(201, "/");
    };
    res.send(`<h1 style="color:red">Somthing Wrong</h1>`)
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
        return res.redirect(403, "/register");
    }
    if(validateEmail(email) == false){
        req.session.error = "Please Enter a Valid Email";
        return res.redirect(403, "/register")
    }
    if(password.length <= 5){
        req.session.error = "Password Should be 6 charter long";
        return res.redirect("/register");

    }
    const hasspass = await bcrypt.hash(password, 10);
    const newuser = new User({
        username: username,
        email: email,
        password: hasspass

    });
    await newuser.save();
    res.status(201).redirect("/login")
});

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};
module.exports = router ;