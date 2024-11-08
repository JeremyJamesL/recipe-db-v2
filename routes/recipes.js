import express from "express";
const router = express.Router();
import { processRecipe } from "../controllers/recipeController.js";
import { getAllRecipes } from "../controllers/recipeController.js";

router.post("/processGetAll", processRecipe, async (req, res) => {
  const collection = req.app.locals.db.collection("recipes");
  const recipes = await getAllRecipes("", collection);
  res.render("homepage.html", { recipes });
});

export default router;
