import express from "express";
import validateToken from "../middleware/validateToken.js";
import {
  getAllRecipes,
  getSingleRecipe,
} from "../controllers/recipeController.js";
const router = express.Router();

router.get("/", validateToken, (req, res) => {
  if (req.loggedIn) {
    res.redirect("/home");
  } else {
    res.render("index.html");
  }
});

router.get("/login", validateToken, (req, res) => {
  if (req.loggedIn) {
    res.redirect("/home");
  } else {
    res.render("login.html");
  }
});

router.get("/sign-up", (req, res) => {
  res.render("sign-up.html");
});

router.post("/logout", (req, res) => {
  res.clearCookie("recipe_user");
  res.clearCookie("token");
  res.set("HX-Redirect", "/").status(200).end();
});

router.get("/home", validateToken, getAllRecipes, async (req, res) => {
  const recipes = req.recipes;
  res.render("homepage.html", { recipes });
});

router.get("/recipes/:id", async (req, res) => {
  const collection = req.app.locals.db.collection("recipes");
  const recipe = await getSingleRecipe(req.params.id, collection);
  res.render("recipe.html", { singleRecipe: recipe });
});

export default router;
