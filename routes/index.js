import express from "express";
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

router.get("/home", (req, res) => {
  res.render("homepage.html");
});

export default router;
