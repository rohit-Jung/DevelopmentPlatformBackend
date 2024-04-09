const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");

const adminCheck = asyncHandler(async (req, res) => {
  //Find the user
  const user = await userModel.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //Extract the isAdmin
  const { isAdmin } = user;

  if (isAdmin) {
    res.status(200).json(new ApiResponse(200, "Hello Admin!, Welcome"));
  } else {
    res.status(400).json(new ApiResponse(400, "Cannot access the admin page"));
  }
});

module.exports = adminCheck;
