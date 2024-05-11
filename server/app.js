const express = require("express");
const cors = require("cors");
require("express-async-errors");
const mongoose = require("mongoose");

// utils
const config = require("./utils/config");
const { info } = require("./utils/logger");
const middleware = require("./utils/middleware");

// controllers
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
const testingRouter = require("./controllers/testing");
const loginRouter = require("./controllers/login");

const app = express();
app.use(express.static("dist"));
const url = config.MONGODB_URI;

mongoose.connect(url).then(() => {
  info("Connected to Mongo DB successfully");
});

// middlewares
app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);

// routes
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/testing", testingRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;
