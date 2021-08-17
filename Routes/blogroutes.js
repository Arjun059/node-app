const express = require('express');
const router = express.Router();
const Modals = require("../modals/modals");
const Blog = Modals.Blog ;
const Comment = Modals.Comment ;
const isAuth = require("../middeware/authcheck");


router.get("/", async (req, res) => {
    const error = req.session.error || "";
    delete req.session.error;
    let user;
    if(req.session.user == undefined){user = "" };
    const blogs = await Blog.find();
    res.render("index", {blogs: blogs, err: error, username: user});
})


router.get("/blog/create", (req, res) => {
   let erro = req.session.error || "" ;
   delete req.session.error;
   res.render("createblog.ejs");
})

router.post("/blog/create", async (req, res) => {
    const {title, content} = req.body;
    if(title == "" || content == ""){
        req.seesion.error = "Title and Content Required";
        return res.redirect("/blog/create");
    }
    var options = {  year: 'numeric', month: 'long', day: 'numeric' };
    var today  = new Date();
    var date = today.toLocaleDateString("en-US", options);

    const newblog = new Blog({
        createdAt: date,
        author: req.session.user,
        title: title,
        content: content
        
    });
    await newblog.save();
    res.redirect("/");
});

router.get("/:blog_id/edit", async (req, res) => {
    const _id = req.params.blog_id;
    const blog = await Blog.findOne({_id: _id});
    res.render("editblog", {blog: blog});
});

router.post("/:blog_id/edit", async (req, res) => {
    const { title, content} = req.body;
    const _id = req.params.blog_id;
    const editblog = await Blog.findByIdAndUpdate({_id: _id},
     {$set:{title: title, content: content}});
    res.redirect("/");
    
});

router.get("/:blog_id/delete", async (req, res) => {
     const _id = req.params.blog_id;
     const blog = await Blog.findByIdAndDelete({_id: _id});
     res.redirect("/");
});

router.get("/blog/comment", (req, res) => {
    res.render("comment");
})

router.post("/:blog_id/comment", async (req, res) => {
    const _id = req.params.blog_id;
    const {comment} = req.body;
    
    const blog = await Blog.findOne({_id: _id});
    const cmt =  new Comment({
       author: req.session.user,
       content: comment,
       blog: blog._id,      
    });

    blog.comment.push(cmt._id);
    res.redirect("/");
})

router.get("/:blog_id/like", async (req, res) => {

    res.redirect("/");
})
module.exports = router ;