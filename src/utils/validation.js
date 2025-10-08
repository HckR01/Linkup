const validator = require("validator");
const validesignUp = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (firstName.length < 3) {
    throw new Error("First name must be at least 3 characters long");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  } else if (!firstName || !lastName) {
    throw new Error("Name is required");
  }
};

module.exports = { validesignUp };
