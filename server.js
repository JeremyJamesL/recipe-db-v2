import { MongoClient } from "mongodb";
import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import defaultRouter from "./routes/index.js";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import recipeRouter from "./routes/recipes.js";
const PORT = 3002;

// Init app
const app = express();

nunjucks.configure("./views", {
  autoescape: true,
  express: app,
  watch: true,
});

app.set("view engine", "html");

// Establish Mongodb connection. DB is passed throughout app using app.locals
MongoClient.connect("mongodb://localhost:27017/")
  .then((client) => {
    console.log("Connected to DB");
    const db = client.db("recipes");
    app.locals.db = db;
  })
  .catch((err) => console.log(err));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
app.use("/", defaultRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/recipes", recipeRouter);

app.listen(PORT, () => {
  `App listening on port ${PORT}`;
});
