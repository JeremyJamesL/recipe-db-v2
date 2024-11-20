import "dotenv/config";
import { checkUserExists } from "./userController.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authenticateUser = async function (req, res) {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).send("please enter an email and password!!");
  }

  const user = await checkUserExists(username, password, collection);

  if (user === null)
    return res
      .status(401)
      .send(
        "<div>that user doesn't exist, please <a href='/login' class='underline'>login</a> instead </div>"
      );

  const passwordIsCorrect = await bcrypt.compare(password, user.password);

  if (!passwordIsCorrect) {
    return res.status(401).send("user not authenticated");
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, {
    expiresIn: "24hr",
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
