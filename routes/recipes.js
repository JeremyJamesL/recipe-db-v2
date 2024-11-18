import express from "express";
const router = express.Router();
import {
  processRecipe,
  getAllRecipes,
  getRecipesByCategory,
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
    res.render("./subs/recipes.html", {
      recipes: req.recipes,
      facets: req.facets,
    });
  }
);

router.post(
  "/deleteGetAll",
  deleteRecipe,
  getAllRecipes,
  getAllFacets,
  async (req, res) => {
    res.render("./subs/recipes.html", {
      recipes: req.recipes,
      facets: req.facets,
    });
  }
);

router.post("/search", getAllFacets, async (req, res) => {
  const { query } = req.body;

  const collection = req.app.locals.db.collection("recipes");

  // TODO: This can be offloaded to /getAllRecipes
  const results = await collection
    .find({ name: { $regex: query, $options: "i" } })
    .toArray();

  if (results.length === 0)
    res.send("<h2>No results, try refining your search!</h2>");
  else
    res.render("./subs/recipes.html", { recipes: results, facets: req.facets });
});

router.get("/category/:id", getRecipesByCategory, getAllFacets, (req, res) => {
  res.render("./subs/recipes.html", {
    recipes: req.recipes,
    facets: req.facets,
    selectedFacet: req.params.id,
    isChecked: req.query.isChecked,
  });
});

router.get("/allRecipes", getAllRecipes, getAllFacets, (req, res) => {
  res.render("./subs/recipes.html", {
    recipes: req.recipes,
    facets: req.facets,
  });
});

export default router;
