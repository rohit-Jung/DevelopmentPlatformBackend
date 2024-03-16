const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const {
  loginUser,
  logoutUser,
  registerUser,
} = require("../controller/userController");
const router = express.Router();

/* GET users listing. */
router.route("/").get((req, res, next) => {
  res.send("respond with a resource");
});

// GET login page
router.route("/login").get((req, res, next) => {
  res.render("login");
});

router.route("/profile").get(verifyJWT, (req, res) => {
  const { fullName, username } = req.user;
  res.render("profile", { fullName, username });
});

router.route("/login").post(loginUser);

router.route("/register").post(registerUser);

router.route("/logout").get(verifyJWT, logoutUser, (req, res) => {
  req.logout(); // Call req.logout() function to logout the user
  res.redirect("/users"); // Redirect the user after logout
});

module.exports = router;
