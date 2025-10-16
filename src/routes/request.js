const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionReq.js");
const User = require("../models/user.js");

const express = require("express");
const requestRouter = express.Router();
//send connection test api post
requestRouter.post("/request/:status/:touserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id; //from user id is the logged in user id
    const toUserId = req.params.touserId;
    const status = req.params.status;

    const allowStatus = ["ignored", "interested"];
    if (!allowStatus.includes(status)) {
      return res.status(400).json("Invalid status");
    }
    //check touserid is valid
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json("To user not found");
    }

    //if there is an existing connection
    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });
    if (existingRequest) {
      return res.status(400).json("Connection request already exists");
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.json({
      message: req.user.firstName + " is " + status + " in " + toUser.firstName,
      data: data,
    });
  } catch (err) {
    res.status(400).send("Internal Server..." + err.message);
  }
});

module.exports = requestRouter;
