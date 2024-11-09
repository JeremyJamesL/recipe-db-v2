import express from "express";
const router = express.Router();
import {
  processRecipe,
  getAllRecipes,
  deleteRecipe,
} from "../controllers/recipeController.js";

router.post(
  "/processGetAll",
  processRecipe,
  getAllRecipes,
  async (req, res) => {
    res.render("homepage.html", { recipes: req.recipes });
  }
);

router.post("/deleteGetAll", deleteRecipe, getAllRecipes, async (req, res) => {
  res.render("homepage.html", { recipes: req.recipes });
});

export default router;
