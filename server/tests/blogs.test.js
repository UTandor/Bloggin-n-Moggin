const { test, beforeEach, after, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const app = require("../app");
const Blog = require("../models/blog");
const supertest = require("supertest");

const initialBlogs = [
  {
    title: "String",
    author: "String",
    url: "String",
    likes: 24,
  },
  {
    title: "New blog",
    author: "kasdfjsd",
    url: "as/dfcpo,",
    likes: 242,
  },
];

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((note) => note.save());
  await Promise.all(promiseArray);
});

describe("API Tests", () => {
  describe("Environment Validation", () => {
    test("NODE_ENV should be set to 'test'", () => {
      assert.strictEqual(process.env.NODE_ENV, "test");
    });
  });

  describe("Getting blogs", () => {
    test("GET request returns valid JSON", async () => {
      await api
        .get("/api/blogs")
        .expect("Content-Type", /application\/json/)
        .expect(200);
    });

    test("Object identification: _id of all objects is named id and is a valid string", async () => {
      const response = await api.get("/api/blogs");
      let validBlogs = 0;
      response.body.forEach((blog) => {
        if (blog.id && !blog._id) {
          validBlogs += 1;
        }
      });
      assert.strictEqual(validBlogs, initialBlogs.length);
    });
  });

  describe("Adding a blog", () => {
    test("Adding a new blog", async () => {
      const newBlog = {
        author: "Jun",
        title: "lkjadlkdsf",
        likes: 30,
        url: "jlkadjflkads.cpom",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, initialBlogs.length + 1);
    });

    test("Handling blogs without provided likes", async () => {
      const newBlog = {
        author: "thing",
        title: "jadsljf",
        url: "jlkadjflkads.cpom",
      };

      const response = await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("Handling incomplete form of a blog", async () => {
      const newBlog = {
        author: "thing",
        url: "jlkadjflkads.cpom",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const response = await api.get("/api/blogs");

      assert.strictEqual(response.body.length, initialBlogs.length);
    });
  });

  describe("Deleting a blog", () => {
    test("Deletes the first blog", async () => {
      const initialResponse = await api.get("/api/blogs");
      const initialBlogsCount = initialResponse.body.length;

      await api.delete(`/api/blogs/${initialResponse.body[0].id}`).expect(204);

      const responseAfterDeletion = await api.get("/api/blogs");
      const updatedBlogsCount = responseAfterDeletion.body.length;

      assert.strictEqual(updatedBlogsCount, initialBlogsCount - 1);
    });

    test("Doesn't delete a non-existent blog", async () => {
      await api.delete("/api/blogs/2244321").expect(404);

      const responseAfterDeletion = await api.get("/api/blogs");
      const updatedBlogsCount = responseAfterDeletion.body.length;

      assert.strictEqual(updatedBlogsCount, initialBlogs.length);
    });
  });

  describe("Updating a blog", () => {
    test("Updates the likes for a specific blog", async () => {
      const initialResponse = await api.get("/api/blogs");

      const updatedBlog = {
        ...initialResponse.body[0],
        likes: 1000,
      };

      await api
        .put(`/api/blogs/${initialResponse.body[0].id}`, updatedBlog)
        .expect(200);

      const updatedResponse = await api.get("/api/blogs");

      assert(updatedResponse.body[0].likes, 1000);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
