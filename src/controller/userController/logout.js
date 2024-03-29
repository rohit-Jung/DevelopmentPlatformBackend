const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  //clearing the refresh token of the user from database
  await userModel.findOneAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const Options = {
    httpsOnly: true,
    secure: true,
  };

  const apiResponse = new ApiResponse(200, {}, "User Logged Out Successfully");
  //log the response
  console.log(JSON.stringify(apiResponse, null, 2));

  //clear the cookie and redirect the response
  res
    .status(200)
    .clearCookie("accessToken", Options)
    .clearCookie("refreshToken", Options)
    .redirect("/users/login");
});

module.exports = logoutUser;
