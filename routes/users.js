import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getSingleUser } from "../controllers/userController.js";
const router = express.Router();

router.post("/add-user", async (req, res) => {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .send("<span class='text-red-500'>Please fill in all fields</span>");
  }
  const pattern = /(?=.*[^\w\s])(?=.*[0-9])/;
  if (username.length < 3 || password.length < 6 || !pattern.test(password)) {
    return res
      .status(400)
      .send(
        "<span class='text-red-500'>Username: longer than 3 character, P/W: Longer than 6 and must contain a number and a special character</span>"
      );
  }
  try {
    const userExists = await collection.findOne({ username });
    if (userExists) {
      return res
        .status(400)
        .send("<span class='text-red-500'>User already exists</span>");
    }
    const hashPW = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashPW,
      createdAt: new Date(),
    };
    await collection.insertOne(newUser);
    res.set("HX-Redirect", "/home").status(200).end();
  } catch (err) {
    console.log(err);
  }
});

router.get("/get-user", getSingleUser);
export default router;
