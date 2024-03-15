//Building up async utility wrapper for async operations

const asyncHandler = (fnc) => async (req, res, next) => { 
  try {
    await fnc(req, res, next);
  } catch (error) {
    res.status(error.statusCode || 500).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = asyncHandler;
