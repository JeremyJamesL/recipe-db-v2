import "dotenv/config";
import jwt from "jsonwebtoken";

const validateToken = (req, res, next) => {
  const token = req.header["authorization"]?.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export default validateToken;
