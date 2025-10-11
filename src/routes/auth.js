const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validesignUp } = require("../utils/validation");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middleware/auth.js");

const authRouter = express.Router();
//signup API add user
authRouter.post("/signup", async (req, res) => {
  try {
    //validation
    validesignUp(req);
    //hash password
    const { firstName, lastName, emailId, password, age, gender } = req.body;
    const passwordHash = await bcrypt.hash(password, 10); //10 is salt rounds
    req.body.password = passwordHash;
    console.log(req.body);

    //make user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
    });
    // //when ever we do db operation we use try catch block

    await user.save();
    res.send("user add done:)");
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(400).send("Internal Server Error" + err.message);
  }
});
//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("emailid not found");
    }
    //check the password by bcrypt
    const result = await user.validatePassword(password); //validatePassword method jo humne user model me banaya hai
    //(small u) → one document (like an instance)
    if (result) {
      //create a jwt token
      const token = await user.getJWT(); //in the user
      console.log(token);
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
      });
      //add the  token to the cookie and send back the user
      res.send("login success");
    } else {
      throw new Error("password incorrect"); //throw error
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(404).send("something went wrong");
  }
});
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.send("logout success");
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(404).send("something went wrong");
  }
});
module.exports = authRouter;
