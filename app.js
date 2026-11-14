"use strict";

const fastify = require("fastify");
const healthRoutes = require("./routes/health");
const tasksRoutes = require("./routes/tasks");
const rootRoutes = require("./routes/root");

function buildApp() {
  const app = fastify();

  app.addContentTypeParser("application/json", { parseAs: "string" }, function (req, body, done) {
    try {
      done(null, JSON.parse(body));
    } catch (err) {
      err.statusCode = 400;
      done(err);
    }
  });

  app.register(rootRoutes);
  app.register(healthRoutes);
  app.register(tasksRoutes);

  return app;
}

module.exports = buildApp;
