const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // If req.user is already present, the user is authenticated
    if (req.user) {
      return next();
    }

    let token;

    // Checking for token in cookies
    // console.log("COOKIES", req.cookies);
    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }
    // Checking for token in Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      // If access token is missing, send a 401 response
      throw new ApiError(401, "Access token missing. User is not authorized");
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    // Finding user by ID or username
    const user = await userModel.findOne({
      $or: [{ _id: decoded._id }, { username: decoded.username }],
    });

    if (!user) {
      // If user not found, send a 401 response
      throw new ApiError(401, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    // Pass the error to the error handling middleware
    next(error);
  }
});

module.exports = verifyJWT;
