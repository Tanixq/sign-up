const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

exports.get_user_signup = (req, res, next) => {
  res.render("sign-up");
};

exports.user_signup = passport.authenticate("local-signup", {
  successRedirect: "/user/successful",
  failureRedirect: "/user/already-exist",
  failureFlash: true,
});

exports.get_user_succesfull_signup = (req, res, next) => {
  User.findById(req.session.passport.user, (err, user) => {
    if (user) {
      res.render("succesful-sign-up", { user: user });
    } else {
      
      res.redirect("/");
    }
  });
};

exports.user_logout = (req, res, next) => {
  req.logout();
  res.redirect("/");
};

exports.successful_redirect = (req, res, next) => {
  res.redirect("/user/successful");
};

exports.already_exist = (req, res, next) => {
  res.render("already-exist");
};
