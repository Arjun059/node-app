const isAuth = function (req, res, next) {

    if (req.session.isAuth == true){
        next();
    }
    else{
        req.session.error = "You have to login first";
        res.redirect("/")

    }
};
module.exports = isAuth;
