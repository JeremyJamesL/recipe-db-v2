import got from "got";
import "dotenv/config";
import { DOMParser, parseHTML } from "linkedom";
import OpenAI from "openai";

//userid collection
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

  const { url } = req.body;

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

    const APIRecipe = {
      name: emptyRecipe.name,
      author: emptyRecipe.author["@id"],
      image: emptyRecipe.image[0],
      ingredients: emptyRecipe.recipeIngredient,
      instructions: emptyRecipe.recipeInstructions.map((el) => el.text),
      url: req.body.url,
      id: `${req.body.url}${req.cookies.recipe_user}`,
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

export { getAllRecipes, getSingleRecipe, processRecipe, deleteRecipe };
