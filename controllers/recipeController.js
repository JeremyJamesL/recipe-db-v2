import got from "got";
import "dotenv/config";
import { DOMParser, parseHTML } from "linkedom";
import OpenAI from "openai";

const getAllRecipes = async function (userID, collection) {
  try {
    const recipes = await collection.find().toArray();
    return recipes;
  } catch (err) {
    console.log(err, "error getting recipes from Mongodb");
    throw new Error("Something went wrong");
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

export { getAllRecipes, getSingleRecipe, processRecipe };
