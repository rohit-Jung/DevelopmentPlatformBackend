var express = require("express");
const { loginUser, registerUser } = require("../controller/user.controller");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// GET login page
router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/logout", function (req, res, next) {
  req.logout();
  res.redirect("/");
});

router.get("/profile", function (req, res) {
  res.render("profile");
});

router.post("/login", loginUser);
router.post("/register", registerUser);

module.exports = router;
