import express from "express";
const router = express.Router();
import {
  processRecipe,
  getAllRecipes,
  deleteRecipe,
  checkRecipeExists,
  getAllFacets,
} from "../controllers/recipeController.js";

router.post(
  "/processGetAll",
  checkRecipeExists,
  processRecipe,
  getAllRecipes,
  getAllFacets,
  async (req, res) => {
    res.render("./subs/recipes.html", { recipes: req.recipes });
  }
);

router.post("/deleteGetAll", deleteRecipe, getAllRecipes, async (req, res) => {
  res.render("homepage.html", { recipes: req.recipes });
});

export default router;
