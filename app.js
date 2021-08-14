const express = require("express");
const path = require('path');

require("dotenv").config();

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

//-------Routes----------------

app.get('/', (req, res) => {
    res.render("index")
});

// ---server running-----------
let PORT = process.env.PORT || 8200 ;
app.listen(PORT, ()=>console.log(`http://localhost:${PORT}/`));