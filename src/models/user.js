const mongoose = require("mongoose");
const Validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported",
      },

      // validate(value) {
      //   const allowedGenders = ["male", "female", "other"];
      //   if (!allowedGenders.includes(value.toLowerCase())) {
      //     throw new Error(
      //       "Invalid gender! Allowed values: male, female, other"
      //     );
      //   }
      // },
    },
    imageUrl: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/Profile-PNG-High-Quality-Image.png",
    },
  },
  { timestamps: true } // Add timestamps option
);
userSchema.index({ firstName: 1, lastName: 1 }); // Create an index on firstName for faster queries

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, "secret@123", {
    expiresIn: "1d",
  });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash
  );
  return isPasswordValid;
};

module.exports = mongoose.model("User", userSchema);
