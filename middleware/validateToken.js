import "dotenv/config";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    req.loggedIn = false;
    next();
  } else {
    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        req.loggedIn = false;
        next();
      } else {
        req.loggedIn = true;
        next();
      }
    });
  }
};

export default validateToken;
