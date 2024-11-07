import "dotenv/config";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).render("error.html", {
      title: "Unauthorized!",
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).render("error.html", {
        title: "Something went wrong, contact the developer",
      });
    req.user = user;
    next();
  });
};

export default validateToken;
