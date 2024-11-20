import got from "got";
import "dotenv/config";
import { DOMParser } from "linkedom";

const getAllFacets = async function (req, res, next) {
  // If user has selected a category, we filter on that in `match`, otherwise it's an empty string
  const selectedCategory = req.params.id || null;

  const { query } = req.body;
  const { recipe_user } = req.cookies;
  let match;
  const pipelineGroup = {
    $group: { _id: "$category", count: { $sum: 1 } },
  };

  // Need to determine what the current state of search is (has the user text queries, selected a category etc).
  // This determines how the aggregation is constructed
  if (selectedCategory !== null && query !== undefined) {
    match = {
      $match: {
        user: recipe_user,
        category: selectedCategory,
        name: { $regex: query, $options: "i" },
      },
    };
  } else if (selectedCategory !== null && query == undefined) {
    match = {
      $match: {
        user: recipe_user,
        category: selectedCategory,
      },
    };
  } else if (selectedCategory == null && query !== undefined) {
    match = {
      $match: {
        user: recipe_user,
        name: { $regex: query, $options: "i" },
      },
    };
  } else {
    match = {
      $match: { user: recipe_user },
    };
  }

  const pipeline = [match, pipelineGroup];

  const collection = req.app.locals.db.collection("recipes");
  const facetsAndCounts = await collection.aggregate(pipeline).toArray();
  const filteredFacets = facetsAndCounts.filter((facet) => facet._id !== "");

  req.facets = filteredFacets;
  next();
};

const getAllRecipes = async function (req, res, next) {
  const collection = req.app.locals.db.collection("recipes");
  try {
    const recipes = await collection.find().toArray();
    req.recipes = recipes;
    next();
  } catch (err) {
    res.status(400).send({
      status: fail,
      message: err.message,
    });
  }
};

const getSingleRecipe = async function (recipeID, collection) {
  try {
    const recipe = await collection.findOne({ id: recipeID });
    return recipe;
  } catch (err) {
    console.log(err);
  }
};

const checkRecipeExists = async function (req, res, next) {
  const collection = req.app.locals.db.collection("recipes");
  const { url } = req.body;
  const user = req.cookies.recipe_user;

  try {
    const recipeExists = await collection.findOne({ url, user });
    if (recipeExists == null) {
      next();
    } else {
      throw new Error();
    }
  } catch (err) {
    res.status(400).send("Recipe already exists");
  }
};

const deleteRecipe = async function (req, res, next) {
  const collection = req.app.locals.db.collection("recipes");
  const { id } = req.body;

  try {
    await collection.deleteOne({ id });
    next();
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err.message,
    });
  }
};

const processRecipe = async function (req, res, next) {
  const collection = req.app.locals.db.collection("recipes");
  const user = req.cookies.recipe_user;

  const { url, category } = req.body;

  try {
    const response = await got(url);
    const document = new DOMParser().parseFromString(response.body);

    const recipeSchema = document.querySelectorAll(
      'script[type="application/ld+json"]'
    );

    const schemaJSON = JSON.parse(recipeSchema[0].innerText);
    const graph = schemaJSON["@graph"];

    let emptyRecipe = {};
    graph.forEach((el) => {
      if (el["@type"] === "Recipe") {
        emptyRecipe = el;
      }
    });

    // Get count of recipes in the DB for recipe ID creation
    const recipeCount = await collection.count();

    const APIRecipe = {
      name: emptyRecipe.name,
      author: emptyRecipe.author["@id"],
      image: emptyRecipe.image[0],
      ingredients: emptyRecipe.recipeIngredient,
      instructions: emptyRecipe.recipeInstructions.map((el) => el.text),
      url: req.body.url,
      id: `recipe__${recipeCount}`,
      category: category.toLowerCase(),
      user,
    };

    await collection.insertOne(APIRecipe);
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

const getRecipesByCategory = async function (req, res, next) {
  const collection = req.app.locals.db.collection("recipes");
  const recipes = await collection.find({ category: req.params.id }).toArray();
  req.recipes = recipes;
  next();
};

export {
  getRecipesByCategory,
  getAllRecipes,
  getSingleRecipe,
  processRecipe,
  deleteRecipe,
  checkRecipeExists,
  getAllFacets,
};
