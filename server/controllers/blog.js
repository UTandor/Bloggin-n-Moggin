const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.status(200).json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;

  jwt.verify(request.token, process.env.SECRET);

  const user = await User.findById(body.user);
  if (user) {
    const blogToSave = new Blog({
      title: body.title,
      author: user.username,
      url: body.url,
      user: user._id,
    });

    const savedBlog = await blogToSave.save();
    user.blogs.push(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  } else {
    response.status(404).json({ error: "Couldn't find such a user." });
  }
});

blogRouter.delete("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);

  const deletedBlog = await Blog.deleteOne({ _id: request.params.id });

  if (deletedBlog) {
    return response.status(204).json({
      deletedBlog: blog,
    });
  } else {
    return response.status(404).json({ error: "Couldn't find such a blog" });
  }
});

blogRouter.put("/:id", async (request, response) => {
  const id = request.params.id;
  const body = request.body;

  const blog = await Blog.findById(id);

  if (!blog) {
    response.status(404).json({ error: "Couldn't find such a blog" });
  }

  const blogToUpdate = {
    user: blog.user,
    likes: body.likes,
    author: body.author,
    url: body.url,
    title: body.title,
  };

  const options = { new: true };

  const updatedBlog = await Blog.findByIdAndUpdate(id, blogToUpdate, options);

  response.status(200).json({
    message: `Updated the likes of blog with id ${id} to ${updatedBlog.likes} likes`,
  });
});

module.exports = blogRouter;
