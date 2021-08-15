const express = require("express");
const router = express.Router();
const session = require('express-session');
const connectmongo = require("connect-mongodb-session")(session);
require('dotenv').config({path:"../.env"});

const store = new connectmongo({
    uri: process.env.mongouri,
    collection: "newsession"
});
router.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    store: store
}));

module.exports = router; 