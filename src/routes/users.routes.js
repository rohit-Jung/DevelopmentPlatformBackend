const express = require("express");
const verifyJWT = require("../middleware/auth.middleware");
const {
  loginUser,
  logoutUser,
  registerUser,
  healthCheck,
  adminAccess
} = require("../controller/userController");
const router = express.Router();

router.route("/").get(healthCheck);

//Handling the POST request
router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/admin").get(verifyJWT, adminAccess)

module.exports = router;
