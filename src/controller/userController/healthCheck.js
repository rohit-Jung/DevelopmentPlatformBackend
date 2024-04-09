const ApiResponse = require("../../utils/ApiResponse.js");
const ApiError = require("../../utils/ApiError.js");
const asyncHandler = require("../../utils/asyncHandler.js");

const healthCheck = asyncHandler(async (req, res) => {
  try {
    // Build healthcheck response
    const healthcheckResponse = new ApiResponse(
      200,
      "OK",
      "Healthcheck successful"
    );
    // Return healthcheck response
    res.status(200).json(healthcheckResponse);
  } catch (error) {
    // Handle errors
    throw new ApiError(500, "Internal server error", error);
  }
});

module.exports = healthCheck;
