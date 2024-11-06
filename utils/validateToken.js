import "dotenv/config";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  console.log("hitting", req.headers["authorization"]);
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default validateToken;
