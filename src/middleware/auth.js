const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  //read the token from the req cookies

  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login first");
    }

    const decodeObject = await jwt.verify(token, "secret@123");
    const { _id } = decodeObject;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user; //Jo user login hai, uska data request ke andar store karo.
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate" });
  }
  //validate the token
  //find user
};

//exporting modules or functions
module.exports = { userAuth };
