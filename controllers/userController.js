const checkUserExists = async function (username, password, collection) {
  const user = await collection.findOne({ username });
  return user;
};

const getSingleUser = async function (req, res) {
  const collection = req.app.locals.db.collection("users");
  const { username, password } = req.query;
  if (!username || !password) {
    return res
      .status(400)
      .send("<span>Enter both a username and password</span>");
  }

  try {
    const userExists = await checkUserExists(username, password, collection);

    if (userExists == null) {
      return res
        .status(400)
        .send(
          "<span class='text-red-500'>User doesn't exist <a href='/sign-up' class='underline'>sign up instead</a>, or maybe you got your username wrong stupid?</span>"
        );
    }

    res.status(200).send({ message: "user found", user: userExists });

    const compare = await bcrypt.compare(password, userExists.password);

    if (!compare) {
      throw new Error("Password is incorrect");
    }

    const user = {
      username: userExists.username,
      password: userExists.password,
      id: userExists._id,
    };

    res.status(200).json(user);
  } catch (err) {
    res.status(400).send(`<span class="text-red-500">${err}</span>`);
  }
};

export { getSingleUser, checkUserExists };
