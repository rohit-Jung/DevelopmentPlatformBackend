//Extending the Error class to make our own standard error response
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    error = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = null;
    this.error = error;

    if (stack) {
        this.stack = ("Stack Trace", stack);
    } else {
        Error.captureStackTrace(this, this.constructor); 
    }
  }
}

module.exports = ApiError;