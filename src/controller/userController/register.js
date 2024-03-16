const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const generateAccessAndRefreshToken = require("./generatetokens");

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;
  console.log(fullName, username, email, password); //Extract details from body

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
  //send response
  console.log(
    JSON.stringify(
      new ApiResponse(200, "User created successfully", userCreate),
      null,
      2
    )
  );
  //redirect to profile after userCreated
  res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .redirect("/users/profile");
});

module.exports = registerUser;
