const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

userRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs").exec();
  response.json(users);
});

userRouter.get("/:username", async (request, response) => {
  const user = await User.findOne({ username: request.params.username })
    .populate("blogs")
    .exec();

  if (user) {
    response.status(200).json(user);
  } else {
    response.status(404).json({ error: "Couldn't find such a user!" });
  }
});
userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  if (username.length <= 3 || password.length <= 3) {
    response.status(400).json({
      error: "Username or password are too short.",
    });
  } else if (!username || !password || !name) {
    response.status(400).json({
      error: "Incomplete format.",
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    name: name,
    username: username,
    passwordHash: passwordHash,
  });

  const savedUser = await user.save();
  response.json(savedUser);
});

module.exports = userRouter;
