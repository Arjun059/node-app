const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    username: {type: String },
    email: {type: String, required: [true, "Email is required "]},
    password: {type: String},
    otpcheck: {type: Boolean, default: false}
}) ;
const User = mongoose.model("User", userSchema);

const blogSchema = new Schema({
    createdAt: {type: String},
    author: {type: String},
    title: {type: String, required: [true, "Title is Required"]},
    content: {type: String, required: [true, "Content is Required"]},
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    like: [{type: mongoose.Schema.Types.ObjectId, ref: "User"},]
});
const Blog = mongoose.model("Blog", blogSchema);

const commentShema = new Schema({
    author: {type: String, required:[true, "author is required"]},
    content: {type: String},
    blog: {type: mongoose.Schema.Types.ObjectId, ref: "Blog"}
});
const Comment = mongoose.model("Comment", commentShema)

const likeSchma = new Schema({
    author: {type: String},
    like:  {type: Boolean},
});

const Like = mongoose.model("Like", likeSchma);

module.exports = {User, Blog, Like, Comment};

