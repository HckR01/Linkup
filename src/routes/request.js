const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionReq.js");
const User = require("../models/user.js");

const requestRouter = express.Router();

// send connection request
requestRouter.post("/request/:status/:touserId", userAuth, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.touserId;
    const status = req.params.status;

    const allowStatus = ["ignored", "interested"];
    if (!allowStatus.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ error: "Connection request already exists" });
    }

    const newRequest = new ConnectionRequest({ fromUserId, toUserId, status });
    const savedRequest = await newRequest.save();

    res.json({
      message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
      data: savedRequest,
    });
  } catch (err) {
    res.status(500).send("Internal Server Error: " + err.message);
  }
});

// respond to connection request
requestRouter.post(
  "/respond/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;

      //status id validation
      const { requestId, status } = req.params;

      const allowStatus = ["accepted", "rejected"];
      if (!allowStatus.includes(status)) {
        return res
          .status(400)
          .json("Invalid status — only accepted/rejected allowed");
      }
      //connection id validation

      const connectionReq = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionReq) {
        return res.status(404).json("Connection request not found");
      }

      connectionReq.status = status;
      const updated = await connectionReq.save();

      res.json({
        message: `You have ${status} the connection request from user ID: ${connectionReq.fromUserId}`,
        data: updated,
      });
    } catch (err) {
      res.status(500).send("Error while accepting/rejecting: " + err.message);
    }
  }
);

module.exports = requestRouter;
