const express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const passport = require("passport");
const cookieSession = require("cookie-session");

const JWT_SECRET = "ThisIsaSecretCode";

// Create a user using POST "/auth/createuser".No login required
router.post("/createuser", async (req, res) => {
  let success = false;
  // check whether the use with this email address exits?
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ error: "Email already Exists!!" });
  }
  let user2 = await User.findOne({ phoneNumber: req.body.phoneNumber });
  if (user2) {
    return res.status(400).json({ error: "Phone Number already Exists!!" });
  }
  const salt = await bcrypt.genSalt(10);
  secPass = await bcrypt.hash(req.body.password, salt);
  // Creating new user in mongoDb
  user = User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    profession: req.body.profession,
    email: req.body.email,
    password: secPass,
  });

  const data = {
    user: {
      id: user.id,
    },
  };
  // singing the token
  const authtoken = jwt.sign(data, JWT_SECRET);
  console.log(authtoken);
  success = true;
  // sending authtoken as response
  res.json({ success, authtoken });
});

// authenticate a user using POST "/auth/login".
router.post("/login", async (req, res) => {
  let success = false;

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Wrong Credentials!" });
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Wrong Credentials!" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    console.log(authtoken);
    success = true;

    res.json({ success, authtoken });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

//route call from frontend to check user successfully logged in or not into google account
router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      error: false,
      message: "Successfully logged in",
      user: req.user,
    });
    // console.log(req.user);
  }
});

//if login fails
router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login Failure",
  });
});

//google authentication callback this will popup the interface with mailids to login
router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

//data to collect from user after successful login
router.get(
  "/google",
  passport.authenticate("google", [
    "profile",
    "email",
    "https://www.googleapis.com/auth/admin.directory.user.readonly",
  ])
);

//facebook authentication callback this will popup the interface to login into facebook
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

//data to collect from user after successful login
router.get("/facebook", passport.authenticate("facebook", ["email"]));

//logout route to clear the user session and logout
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
  });
  res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
