"use strict";

const fastify = require("fastify");
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

function buildApp () {
  const app = fastify({ logger: true });

  app.get("/ping", async () => {
    return { status: "ok" };
  });

  return app
}

module.exports = buildApp;
