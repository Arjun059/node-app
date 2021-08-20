const express = require('express');
const router = express.Router();
const Modals = require("../modals/modals");
const Blog = Modals.Blog ;
const Comment = Modals.Comment ;
const isAuth = require("../middeware/authcheck");


router.get("/", async (req, res) => {
    console.log("req.hiit")
    const error = req.session.error || "";
    delete req.session.error;
    let user = req.session.user || null ;
   
    const blogs = await Blog.find();

    res.render("index", {blogs: blogs, err: error, username: user});
})

router.use(isAuth);

router.get("/blog/create", (req, res) => {
   let erro = req.session.error || "" ;
   delete req.session.error;
   res.render("createblog.ejs");
})

router.post("/blog/create", async (req, res) => {
    const {title, content} = req.body;

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

router.get("/:blog_id/showFb",async (req, res) => {
    let _id = req.params.blog_id;
    let user = req.session.user || null ;
    let blog = await Blog.findById({_id: _id}).populate("comment");
    
    res.render("showFb", {blog: blog, username: user});
})

router.post("/:blog_id/comment", async (req, res) => {
    const _id = req.params.blog_id;
    const {comment} = req.body;

    const cmt =  new Comment({
       author: req.session.user,
       content: comment,
       blog: _id,      
    });
    await cmt.save();
    let cmtblog = await Blog.findOneAndUpdate({_id: _id}, {
        $push: {comment: cmt._id}
    });
    res.redirect(`/${_id}/showFb`);
})

router.get("/:blog_id/like", async (req, res) => {
    let _id = req.params.blog_id;
    let userId = req.session.userId;

    
    let isliked = await Blog.find({ _id: _id,
     like: { $in: [userId] },
    })
    .count();
    if(isliked == true){

        await Blog.findOneAndUpdate({_id: _id}, {
            $pull: {like:userId}
        })
        return res.redirect("/");
    }
    
    const islike = await Blog.findOneAndUpdate({_id: _id}, {
        $push: {like:userId}
    })
    if(islike !== null){
        res.redirect("/")
    
    }
})

module.exports = router ;