const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const {
  loginUser,
  logoutUser,
  registerUser,
} = require("../controller/userController");
const router = express.Router();

/* GET users page. */
router.route("/").get((req, res, next) => {
  res.render("index", {title: "Users Page"});
});

// GET login page
router.route("/login").get((req, res, next) => {
  //to redirect the logged in user to the profile
  if (req.user || req.cookies?.accessToken) {
    res.redirect("/users/profile");
  } else {
    // User is not logged in, render the login form
    res.render("login");
  }
});

router.route("/profile").get(verifyJWT, (req, res) => {
  //since the verifyJWT stores the info in req.user
  const { fullName, username } = req.user; //Extract the details
  res.render("profile", { fullName, username });
});

router.route("/logout").get(verifyJWT, logoutUser, (req, res) => {
  req.logout(); // Calling req.logout() function to logout the user
});

//Handling the POST request
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;
