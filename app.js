const express = require("express");
const path = require('path');
const mongoose = require('mongoose');
const isAuth = require("./middeware/authcheck");

require("dotenv").config();
// ------mongooe connection -----
mongoose.connect(process.env.mongouri,
    {useNewUrlParser: true, useUnifiedTopology:true, useCreateIndex: true},
    ()=> console.log("db connected"));
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

//=============Routes=====================
// --------session_logic_routes --------
app.use(require("./Routes/sessionroutes"));
// --------login_register_logic_routes-------
app.use(require("./Routes/loginroutes"));
// ---------blog_logic_routes----------
app.use(require("./Routes/blogroutes"));


// ---server running-----------

let PORT = process.env.PORT || 8200;
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}/`));