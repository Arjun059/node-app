function isAuth(req,res,next) {
    if (req.session.isAuth) {
        next();
    }else{
        req.session.error = "You Have To LogIn First"
        res.redirect("/")
    }
}
module.exports = isAuth;