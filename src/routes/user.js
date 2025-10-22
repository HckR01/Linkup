const express = require("express");
const { userAuth } = require("../middleware/auth.js");
const ConnectionRequest = require("../models/connectionReq.js");
const User = require("../models/user.js");

const userSafeData = "firstName lastName age gender imageUrl";

const userRouter = express.Router();

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedinUser._id,
      //   status: "interested",
    }).populate("fromUserId", "firstName lastName");
    res.send(connectionRequest);
  } catch (err) {
    res.status(400).send("ERROR in Userjs user/request: " + err.message);
  }
});
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const connectionsRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedinUser._id, status: "accepted" },
        { fromUserId: loggedinUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", "firstName lastName")
      .populate("fromUserId", "firstName lastName");

    const data = connectionsRequest.map((connection) => {
      if (connection.fromUserId._id.equals(loggedinUser._id)) {
        return connection.toUserId; // Return the connected user's details
      } else {
        return connection.fromUserId; // Return the connected user's details
      }
    });
    res.send(data);
  } catch (err) {
    res.status(400).send("ERROR in Userjs user/connections: " + err.message);
  }
});
userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user; //todo->1.user can see all card but not its won and
    //2.ignored people
    //3.alredy sent the connection request
    //
    //find all the connection request sent + receive
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedinUser._id }, { toUserId: loggedinUser._id }],
    }).select("fromUserId toUserId status");
    //userid and touserid and store like a array and dont allow duplicates
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
      // console.log("HIDE USERS FROM FEED SET:", hideUsersFromFeed);
    });

    //now we have hide user details
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedinUser._id } },
      ],
    }).select(userSafeData);

    //

    res.send(users);
  } catch (err) {
    res.status(400).send("ERROR in Userjs /feed: " + err.message);
  }
});
module.exports = userRouter;
