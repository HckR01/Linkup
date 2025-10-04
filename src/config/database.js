const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NamasteDev:zOV7hMhpSHo63v28@namastenode.qhtmwfd.mongodb.net/devTinder"
  );
};

//export the function
module.exports = connectDB;
