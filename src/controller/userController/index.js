const loginUser = require("./login");
const logoutUser = require("./logout");
const registerUser = require("./register");
const adminAccess = require("./adminAccess");
const healthCheck = require("./healthCheck");

module.exports = {
  loginUser,
  logoutUser,
  registerUser,
  adminAccess,
  healthCheck,
};
