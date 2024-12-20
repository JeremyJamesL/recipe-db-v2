import express from "express";
import validateToken from "../middleware/validateToken.js";
import {
  getAllRecipes,
  getSingleRecipe,
  getAllFacets,
} from "../controllers/recipeController.js";
const router = express.Router();

// Page requests
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

router.get("/sign-up", validateToken, (req, res) => {
  if (req.loggedIn) {
    res.redirect("/home");
  } else {
    res.render("sign-up.html");
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("recipe_user");
  res.clearCookie("token");
  res.set("HX-Redirect", "/").status(200).end();
});

router.get(
  "/home",
  validateToken,
  getAllRecipes,
  getAllFacets,
  async (req, res) => {
    if (req.loggedIn) {
      const recipes = req.recipes;
      const facets = req.facets;
      res.render("homepage.html", { recipes, facets });
    } else {
      res.redirect("/");
    }
  }
);

// Content requests
router.get("/submitForm", getAllFacets, (req, res) => {
  res.render("./components/recipe-form.html", {
    selectOptions: req.facets,
  });
});

router.get("/homeContent", getAllRecipes, getAllFacets, async (req, res) => {
  const recipes = req.recipes;
  const facets = req.facets;
  res.render("./components/homepage-content.html", { recipes, facets });
});

router.get("/newCategoryInput", (req, res) => {
  res.render("./components/recipe-category-mode.html");
});

router.post("/updatedFormWithNewCat", getAllFacets, (req, res) => {
  const { new_category } = req.body;
  req.facets.push({ _id: new_category, count: 0 });
  res.render("./components/recipe-form.html", {
    selectOptions: req.facets,
    showNewCatBtn: false,
  });
});

router.get("/recipes/:id", async (req, res) => {
  const collection = req.app.locals.db.collection("recipes");
  const recipe = await getSingleRecipe(req.params.id, collection);
  res.render("recipe.html", { singleRecipe: recipe });
});

export default router;
