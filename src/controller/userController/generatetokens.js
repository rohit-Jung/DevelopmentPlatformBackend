const userModel = require("../../models/user.model");

//generate the tokens
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user.generateAuthToken();
    const refreshToken = await user.generateRefreshToken();


    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating tokens");
  }
};

module.exports = generateAccessAndRefreshToken;
