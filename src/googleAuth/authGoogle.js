const passport = require("passport");
const userModel = require("../models/user.model");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
var GoogleStrategy = require("passport-google-oauth20").Strategy;

// Passport Configuration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/users/auth/google/callback",
      scope: ["profile", "email"],
    },
    async (accessToken, profile) => {
      try {
        console.log("Tokens Here:", accessToken);
        let user = await userModel.findOne({ username: profile.id });
        if (!user) {
          const newUser = await userModel.create({
            username: profile.id,
            email: profile.emails[0].value,
            fullName: profile.displayName,
            refreshToken: accessToken, // Saving refresh token in the database
          });
          console.log(newUser);
          if (!newUser) {
            throw new ApiError(500, "Error creating user");
          }
          user = newUser; // Update user variable with newly created user
        }
        return new ApiResponse(200, "Successfully logged in", user);
      } catch (err) {
        return new ApiError(500, "Error creating user", err);
      }
    }
  )
);

// Serialize and Deserialize User
//serialize and deserialize are methods used to store and retrieve data
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});
