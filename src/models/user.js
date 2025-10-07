const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3, // ✅ fixed
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  emailId: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    validate(value) {
      const allowedGenders = ["male", "female", "other"];
      if (!allowedGenders.includes(value.toLowerCase())) {
        throw new Error("Invalid gender! Allowed values: male, female, other");
      }
    },
  },
});

module.exports = mongoose.model("User", userSchema);
