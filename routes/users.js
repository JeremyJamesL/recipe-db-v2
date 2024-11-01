import "dotenv/config";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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
    console.log("not a valid password");
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

router.get("/get-user", async (req, res) => {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.query;

  if (!username || !password) {
    return res
      .status(400)
      .send("<span>Enter both a username and password</span>");
  }

  try {
    const userExists = await collection.findOne({ username });

    if (userExists == null) {
      return res
        .status(400)
        .send(
          "<span class='text-red-500'>User doesn't exist <a href='/sign-up' class='underline'>sign up instead</a>, or maybe you got your username wrong stupid?</span>"
        );
    }

    const compare = await bcrypt.compare(password, userExists.password);

    if (!compare) {
      throw new Error("Password is incorrect");
    }

    const user = {
      username: userExists.username,
      password: userExists.password,
      id: userExists._id,
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "2h" });
    res.set({ "Auth-token": token, "HX-Redirect": "/home" }).status(200).end();
  } catch (err) {
    res.status(400).send(`<span class="text-red-500">${err}</span>`);
  }
});

export default router;
