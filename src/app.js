const express = require("express");
// const { auth } = require("./middleware/auth.js"); // ✅ fixed import
const connectDB = require("./config/database");
const User = require("./models/user");
const { validesignUp } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

app.use(express.json()); //middleware to parse json data
//call api ...........................................................
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("emailid not found");
    }
    //check the password by bcrypt
    const result = await bcrypt.compare(password, user.password);
    //(small u) → one document (like an instance)
    if (result) {
      res.send("login success");
    } else {
      throw new Error("password incorrect"); //throw error
    }
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(404).send("something went wrong");
  }
});
//find user by the email
app.get("/user", async (req, res) => {
  try {
    //here users is a array after use the find method it send back a array
    const user = await User.find({ age: req.body.age });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(404).send("something went wrong");
  }
});

//FEED API to get all the data to the db
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    console.error("Error finding user:", err);
    res.status(404).send("something went wrong");
  }
});

//delete id
app.delete("/duser", async (req, res) => {
  const userId = req.body.userId; // <-- matches your Postman key
  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User deleted successfully");
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).send("Something went wrong");
  }
});
//update user
app.patch("/userupdate/:userId", async (req, res) => {
  const userId = req.params?.userId; // extract userId from params
  const data = req.body;

  try {
    const allowedUpdates = ["gender", "age", "lastName", "firstName"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );
    if (isUpdateAllowed === false) {
      throw new Error("Invalid updates!");
    }

    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
      returnDocument: "after",
    });
    console.log(user);

    res.send("updated successfully"); // send the updated user
  } catch (err) {
    res.status(400).send("Something went wrong" + err.message);
  }
});

//.....................................................................

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
