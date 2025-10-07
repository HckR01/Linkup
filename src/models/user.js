const mongoose = require("mongoose");
const Validator = require("validator");

const userSchema = new mongoose.Schema(
  {
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
      trim: true,
      validate(value) {
        if (!Validator.isEmail(value)) {
          throw new Error("Invalid email format");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!Validator.isStrongPassword(value)) {
          throw new Error("Invalid password format");
        }
      },
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
          throw new Error(
            "Invalid gender! Allowed values: male, female, other"
          );
        }
      },
    },
  },
  { timestamps: true } // Add timestamps option
);

module.exports = mongoose.model("User", userSchema);
