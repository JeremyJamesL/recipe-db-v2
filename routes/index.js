import express from "express";
import validateToken from "../utils/validateToken.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index.html");
});

router.get("/login", (req, res) => {
  res.render("login.html");
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up.html");
});

router.get("/home", validateToken, (req, res) => {
  res.render("homepage.html");
});

export default router;
