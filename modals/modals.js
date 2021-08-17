const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: [true, "username is required"], unique: true},
    email: {type: String, required: [true, "Email is required "]},
    password: {type: String, min:[6, "password should be 6 charter long"], 
               required: [true, "password is required"]}
}) ;
const User = mongoose.model("User", userSchema);

const blogSchema = new Schema({
    createdAt: {type: String},
    author: {type: String},
    title: {type: String, required: [true, "Title is Required"]},
    content: {type: String, required: [true, "Content is Required"]},
    comment: [{type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    like: [{type:Object}]

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

