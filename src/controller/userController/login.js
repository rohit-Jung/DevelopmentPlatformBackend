const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const generateAccessAndRefreshToken = require("./generatetokens");

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body; //Extract details from body
  console.log(email, password);

  if (!(username || email) && !password) {
    //Check for email or username
    throw new ApiError(400, "Please provide an email or password");
  }

  //Find user in database
  const user = await userModel.findOne({ $or: [{ email }, { password }] });

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
  // console.log(accessToken, refreshToken);
  

  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken");

  const Options = {
    httpsOnly: true,
    secure: true,
  };

  const apiResponse = new ApiResponse(
    200,
    {
      refreshToken,
      accessToken,
      loggedInUser,
    },
    "User Logged In Successfully"
  );

  console.log(JSON.stringify(apiResponse, null, 2));

  res
    .status(200)
    .cookie("accessToken", accessToken, Options)
    .cookie("refreshToken", refreshToken, Options)
    .redirect("/users/profile");
});

module.exports = loginUser;
