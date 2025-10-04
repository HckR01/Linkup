export const auth = (req, res, next) => {
  const token = "xyz";
  const userToken = req.query.token; // or from header/body

  if (userToken !== token) {
    return res.status(403).send("Forbidden");
  }
  console.log("Admin authorized");
  next();
};
