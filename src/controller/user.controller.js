const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");

//generate the tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const access_token = user.generateAuthToken();
    const refresh_token = user.generateRefreshToken();

    user.refreshToken = refresh_token;
    await user.save({ validateBeforeSave: false });
    return { access_token, refresh_token };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body; //Extract details from body

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    //Details check
    throw new ApiError(404, "All the fields are required");
  }
  //check if the user is already registered
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(409, "User already exists");
  }
  //create user obj
  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  const userCreate = await User.findById(user.id).select(
    "-password -refreshToken"
  );

  if (!userCreate) {
    throw new ApiError(500, "User creation failed");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "User created successfully", userCreate));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body; //Extract details from body
  console.log(username, password);

  if (!(username || password)) {
    //Check for email or password
    throw new ApiError(400, "Please provide an email or password");
  }

  //Find user in database
  const user = await User.findOne({ $or: [{ email }, { password }] });

  //check for user
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //check for password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const Options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .json(
      new ApiResponse(
        200,
        {
          refreshToken,
          accessToken,
          loggedInUser,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findOneAndUpdate(
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

  return res
    .status(200)
    .clearCookie("accessToken", Options)
    .clearCookie("refreshToken", Options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

module.exports = { registerUser, loginUser };
