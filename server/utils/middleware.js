const User = require("../models/user");
const logger = require("./logger");
const jwt = require("jsonwebtoken");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "Unknown endpoint." });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "Malformated id." });
  } else if (error.name === "ValidationError") {
    response.status(400).json({ error: "Incomplete format." });
  } else if (error.name === "JsonWebTokenError") {
    response.status(401).json({ error: "Invalid token." });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    response.status(400).json({ error: "Expected username to be unique." });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
  console.log(error);

  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    request.token = authorization.substring(7);
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = (request, response, next) => {
  if (request.token) {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET);
      User.find({});
      request.user = decodedToken;
    } catch (error) {
      request.user = null;
    }
  } else {
    request.user = null;
  }
  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
