const http = require("http");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");

const port = parseInt(process.env.PORT, 10) || 8000;

// Set up the express app
const app = express();
const server = http.createServer(app);

// Log requests to the console.
app.use(logger("dev"));

// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Require our routes into the application.
require("./server/routes")(app);
app.get("*", (req, res) =>
  res.status(200).send({
    message: "Welcome!"
  })
);

module.exports = app;

// app.set("port", port);
// server.listen(port);