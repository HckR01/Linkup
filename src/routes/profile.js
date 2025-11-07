const { userAuth } = require("../middleware/auth.js");
const { validateProfileData } = require("../utils/validation");
const express = require("express");

const profileRouter = express.Router();

//profile api
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; //coming from the middleware

    console.log(user.firstName);
    res.send(user._id);
  } catch (err) {
    res.status(400).send("Error in profile" + " " + err.message);
  }
});
//profile view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; //coming from the middleware
    res.send(user);
  } catch (err) {
    res.status(400).send("Error in profile" + " " + err.message);
  }
});
//profile edit
profileRouter.patch("/editprofile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileData(req)) {
      throw new Error("Invalid updates!");
    }
    const loggedinuser = req.user; //coming from the middleware
    Object.keys(req.body).forEach((field) => {
      loggedinuser[field] = req.body[field];
    });
    await loggedinuser.save();
    res.send(`profile updated ${loggedinuser.firstName}`);
    // console.log(loggedinuser); for showing  updated user
  } catch (err) {
    res.status(400).send("Error in " + "  " + err.message);
  }
});
module.exports = profileRouter;
