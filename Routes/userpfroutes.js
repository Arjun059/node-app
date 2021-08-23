const express = require('express');
const router = express.Router();
const Modals = require('../modals/modals');
const Blog = Modals.Blog;
const Comment = Modals.Comment;
const User = Modals.User;

router.get("/userpf", async (req, res) => {
    const username = req.session.user || null ;
    const user = await User.findOne({_id: req.session.userId});
    const email = user.email || null ;

    res.render("userpf", {username: username, useremail: email});
});

router.get("/user/blog", async (req, res) => {
    if(!req.session.user) return res.redirect("/");

    
    const error = req.session.error || "";
    delete req.session.error;
    let user = req.session.user || null ;
   
    const blogs = await Blog.find({author: req.session.user});

    res.render("index", {blogs: blogs, err: error, username: user});
    
})

module.exports = router;

