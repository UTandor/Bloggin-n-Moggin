const router = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");

router.post("/reset", async (request, response) => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  response.status(200).json({ message: "reset the database successfully." });
  console.log("reset the database");
});

module.exports = router;
