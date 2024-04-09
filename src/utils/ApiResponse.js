//Creating a ApiResponse class to create a standard response structure

class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

module.exports = ApiResponse;