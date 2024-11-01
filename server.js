import { MongoClient } from "mongodb";
import "dotenv/config";
import express from "express";
import nunjucks from "nunjucks";
import bodyParser from "body-parser";
import defaultRouter from "./routes/index.js";
import userRouter from "./routes/users.js";
const port = 3002;

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
app.use(bodyParser.json());
app.use("/", defaultRouter);
app.use("/api/users", userRouter);

app.listen(port, () => {
  `App listening on port ${port}`;
});
