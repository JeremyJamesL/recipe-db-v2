import "dotenv/config";
import { checkUserExists } from "./userController.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authenticateUser = async function (req, res) {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.body;
  const user = await checkUserExists(username, password, collection);
  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) res.status(401).send("user not authenticated");

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "2hr",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.cookie("recipe_user", user.username);

  res.status(200).send("JWT has been set in cookie");
};

export { authenticateUser };
