import express from "express";
import { authenticateUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/authenticate", authenticateUser);

export default router;
