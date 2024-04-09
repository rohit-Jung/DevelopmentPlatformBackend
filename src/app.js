var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var usersRouter = require("../src/routes/users.routes");

var app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "../public")));

// Set up CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

// Logger middleware
app.use(logger("dev"));

// Parse incoming requests with JSON payloads
app.use(express.json({ limit: "16kb" }));

// Parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Parse cookies
app.use(cookieParser());

// Set up routes
app.use("/", usersRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
