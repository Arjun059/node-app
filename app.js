const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const isAuth = require("./middeware/authcheck");

require("dotenv").config();


// ------mongooe connection -----
mongouri = String(process.env.mongouri);
mongoose.connect( mongouri, 
    {useNewUrlParser:true, useUnifiedTopology: true, useCreateIndex: true},
    () => console.log("db connnected"))

//------express init---------
const app = express();

//------static folder-----------
app.use(express.static("public"));

//-----body parseer------------
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//------view engine setup------
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname + "/views"));

// --------session uses --------
app.use(require("./Routes/sessionroutes"));
//---------login-register-------
app.use(require("./Routes/loginroutes"));

//-------Routes----------------
app.get('/', (req, res) => { 
    res.status(200);
    res.render("index");
});
app.get("/private", isAuth, (req, res) => {
    res.send("auth cheched")
})
app.get("/create", (req, res) => {
    res.render("composeblog.ejs")
})
app.get("/edit", (req, res) => {
    res.render('editblog')
})
// ---server running-----------

let PORT = process.env.PORT || 8200;
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}/`));