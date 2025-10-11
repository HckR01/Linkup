const { userAuth } = require("../middleware/auth.js");

const express = require("express");
const requestRouter = express.Router();
//send connection test api post
requestRouter.post("/sendconnectionRequest", userAuth, (req, res) => {
  const user = req.user;
  res.send(`connection request sent to ${user.firstName}`);
});

module.exports = requestRouter;
