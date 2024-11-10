import "dotenv/config";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token)
    return res.status(401).render("error.html", {
      title: "Unauthorized!",
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      res.sendStatus(401);
    } else {
      req.user = user;
      next();
    }
  });
};

export default validateToken;
