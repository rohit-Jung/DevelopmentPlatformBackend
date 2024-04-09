const mongoose = require("mongoose");
const userModel = require("../../models/user.model");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const logoutUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Clearing the refresh token of the user from the database
  const deletedUser = await userModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(user._id) }, // Convert user._id to ObjectId
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  if (!deletedUser) {
    throw new ApiError(500, "User deletion failed");
  }

  const Options = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
  };

  console.log(deletedUser);

  // Set cache-control headers to prevent caching
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  // Clear the cookies and send the response
  res
    .status(200)
    .clearCookie("accessToken", Options)
    .clearCookie("refreshToken", Options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

module.exports = logoutUser;
