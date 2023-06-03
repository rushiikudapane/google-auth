const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      // done(null, profile);

      console.log(profile._json);
      process.nextTick(function () {
        User.findOne({ email: profile._json.email }, function (err, user) {
          if (err) return done(err);
          if (user) {
            console.log("user found");
            console.log(user);
            return done(null, user); // user found return that user
          } else {
            //if no user present in database with same mail id create a new user into database
            console.log("user not found");
            const newUser = new User();
            newUser.firstName = profile._json.name;
            newUser.lastName = profile._json.name;
            newUser.email = profile._json.email;
            newUser.gender = "male";
            newUser.date = new Date();
            newUser.phoneNumber = 8783493;
            newUser.profession = "doctor";
            newUser.password = "123e34";

            newUser.save(function (err) {
              return done(null, newUser);
            });
          }
        });
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "1252287072357799",
      clientSecret: "1214f8072e24494bc2d7a01fb9cb23b5",
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "name", "gender", "email"],
    },
    function (accessToken, refreshToken, profile, done) {
      // done(null, profile);

      // to insert user into database
      process.nextTick(function () {
        User.findOne(
          { firstName: profile._json.first_name },
          function (err, user) {
            if (err) return done(err);
            if (user) {
              //user present in database
              console.log("user found");
              console.log(user);
              return done(null, user); // user found return that user
            } else {
              //if no user present in database with same mail id create a new user into database
              console.log("user not found");
              const newUser = new User();
              newUser.firstName = profile._json.first_name;
              newUser.lastName = profile._json.last_name;
              newUser.email = profile._json.first_name;
              newUser.gender = "male";
              newUser.date = new Date();
              newUser.phoneNumber = 878334493;
              newUser.profession = "doctor";
              newUser.password = "123e34";

              newUser.save(function (err) {
                if (err) {
                  throw err;
                } else {
                  return done(null, newUser);
                }
              });
            }
          }
        );
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
