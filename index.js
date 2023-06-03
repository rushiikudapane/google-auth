const express = require("express");
const connectToMongo = require("./db");
var cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const cookieSession = require("cookie-session");
const passportSetup = require("./passport");

const app = express();

app.use(
  cookieSession({
    name: "session",
    keys: ["demo"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: "GET, PUT, POST, DELETE",
    credentials: true,
  })
);

// to deal requests in json format
app.use(express.json());

connectToMongo();

const port = 4000;

// Available routes
app.use("/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
