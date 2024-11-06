import { checkUserExists } from "./userController.js";

const authenticateUser = async function (req, res) {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.body;
  const user = await checkUserExists(username, password, collection);
  console.log(user, "logging");
  //   const { username, password } = req.query;
};

export { authenticateUser };
