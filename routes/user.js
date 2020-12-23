const express = require("express");
const router = express.Router();
const controllers = require("../controllers/user");
const passport = require("passport");

// get route
router.get("/sign-up", notLoggedIn, controllers.get_user_signup);
router.get("/successful", isLoggedIn, controllers.get_user_succesfull_signup);
router.get("/already-exist",isLoggedIn, controllers.already_exist);
router.get("/logout", isLoggedIn, controllers.user_logout);
router.get(
  "/auth/google",
  notLoggedIn,
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  notLoggedIn,
  passport.authenticate("google", { failureRedirect: "/user/sign-up" }),
  controllers.successful_redirect
);

router.get("/auth/facebook", notLoggedIn, passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  notLoggedIn,
  passport.authenticate("facebook", { failureRedirect: "/user/sign-up" }),
  controllers.successful_redirect
);

router.get(
  "/auth/github/",
  notLoggedIn,
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  notLoggedIn,
  passport.authenticate("github", { failureRedirect: "/user/sign-up" }),
  controllers.successful_redirect
);

router.get(
  "/auth/linkedin",
  passport.authenticate("linkedin", { state: "SOME STATE" }),
  function (req, res) {}
);

router.get(
  "/auth/linkedin/callback",
  passport.authenticate("linkedin", {
    successRedirect: "/user/successful",
    failureRedirect: "/user/sign-up",
  })
);

// post route
router.post("/sign-up", notLoggedIn, controllers.user_signup);

module.exports = router;

// functions for checking authentication
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/user/sign-up");
}

function notLoggedIn(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}
