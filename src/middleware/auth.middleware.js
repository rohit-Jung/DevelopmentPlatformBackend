const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    let token;

    // Checking for token in cookies
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies?.accessToken;
    }
    // Checking for token in Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // console.log(
      //   new ApiError(401, "Access token missing. User is not authorized")
      // );

      // Redirect to the login page if the access token is missing
      res.redirect("/users/login");

      // Return here to prevent further execution of code
      return;
    }

    // console.log(req.cookies);
    // console.log("Access Token:", token);

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    // console.log("Decoded Token:", decoded);

    const user = await userModel.findById(decoded._id);
    // console.log("User Data:", user);

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    throw new ApiError(401, error.message || "Invalid Access Token");
  }
});

module.exports = verifyJWT;
