import express from "express";
const router = express.Router();
import { processRecipe } from "../controllers/recipeController.js";

router.post("/process", (req, res) => {
  console.log(req.body);
  const { url } = req.body;

  processRecipe(url);
});

export default router;
