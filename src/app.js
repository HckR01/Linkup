// console.log("Hello, world!");
const express = require("express");
const app = express();
const port = 3000;

// app.use(
//   "/",
//   (req, res, next) => {
//     next();
//     console.log("first response 1 ");
//     res.send("Response 1 is here!");
//   },
//   (req, res) => {
//     res.send("Response 2 is here!");
//     console.log("second response 2 ");
//   }
// );

//routes handeler

//1.this code run every routes that going to run and print the which paze or url user call
// app.use((req, res, next) => {
//   console.log(`Request URL: ${req.url}`);
//   next(); // move to next middleware or route handler
// });

//2. specific routes
// app.get("/", (req, res) => {
//   res.send("Home Page");
// });
// app.get("/login", (req, res) => {
//   res.send("login Page");
// });

//3. specific middleware ran for specific routes call
// app.use("/admin", (req, res, next) => {
//   console.log("Admin middleware ran!");
//   next();
// });

// app.get("/admin/dashboard", (req, res) => {
//   res.send("Admin Dashboard");
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
