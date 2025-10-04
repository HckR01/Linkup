const express = require("express");
// const { auth } = require("./middleware/auth.js"); // ✅ fixed import
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const port = 3000;

//call api
app.post("/signup", async (req, res) => {
  //make user instance to put in the database
  const user = new User({
    firstName: "John",
    lastName: "Doe",
    emailId: "Y7A7o@example.com",
    password: "123456",
    age: 25,
    gender: "male",
  });
  //when ever we do db operation we use try catch block

  try {
    await user.save();
    res.send("user add done:)");
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(400).send("Internal Server Error");
  }
});

//call the function and error handel
connectDB()
  .then(() => {
    console.log("DB CONNECTED");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
      //note->here in production level we do connect our db first then call the server
    });
  })
  .catch((err) => {
    console.error("connection failed ", err);
  });
