const mongoose = require("mongoose");
const mongoURI =
  "mongodb+srv://chaetesh:nani3214@cluster0.ubpgrwn.mongodb.net/?retryWrites=true&w=majority";

const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to Mongod Succesfully");
  });
};

// This module will get exported
module.exports = connectToMongo;
