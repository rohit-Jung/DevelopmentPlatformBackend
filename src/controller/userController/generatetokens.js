const userModel = require("../../models/user.model");
const ApiError = require("../../utils/ApiError");

//generate the tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    //Find the user from the database
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    //generate the tokens from the methods we have
    const accessToken = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();

    //save the refresh token into the database
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    //return the tokens
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

module.exports = generateAccessAndRefreshToken;
