const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const generateAccessAndRefreshToken = require("./generatetokens");

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password, isAdmin } = req.body;
  console.log(fullName, username, email, password, isAdmin); //Extract details from body

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    //Details check
    throw new ApiError(404, "All the fields are required");
  }
  //check if the user is already registered
  const userExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }
  //create user obj
  const user = await userModel.create({
    fullName,
    username,
    email,
    password,
    isAdmin
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  //for sending response
  const userCreate = await userModel
    .findById(user.id)
    .select("-password -refreshToken");

  if (!userCreate) {
    throw new ApiError(500, "User creation failed");
  }

  const Options = {
    httpsOnly: true,
    secure: true,
  };

  //send the response
  res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .json(new ApiResponse(200, "User created successfully", userCreate));
});

module.exports = registerUser;
