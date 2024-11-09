import express from "express";
import validateToken from "../utils/validateToken.js";
import {
  getAllRecipes,
  getSingleRecipe,
} from "../controllers/recipeController.js";
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

router.get("/home", validateToken, getAllRecipes, async (req, res) => {
  // This comes from getAllRecipes
  const recipes = req.recipes;
  res.render("homepage.html", { recipes });
});

router.get("/recipes/:id", async (req, res) => {
  const collection = req.app.locals.db.collection("recipes");
  const recipe = await getSingleRecipe(req.params.id, collection);
  res.render("recipe.html", { singleRecipe: recipe });
});

export default router;
