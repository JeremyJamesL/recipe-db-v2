// const got = require("got");
// const linkedom = require("linkedom");
// const { DOMParser, parseHTML } = linkedom;

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

const processRecipe = async function (url) {};

export { getAllRecipes, getSingleRecipe, processRecipe };
