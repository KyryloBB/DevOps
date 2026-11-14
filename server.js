"use strict";

const buildApp = require("./app");
const pool = require("./db/pool");
const fs = require("fs");
const path = require("path");

const configPath = path.resolve(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

const app = buildApp();

const start = async () => {
  try {
    await app.listen({
      port: config.server.port,
      host: config.server.host,
    });
    console.log(`Server listening on ${config.server.host}:${config.server.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

const signals = ["SIGINT", "SIGTERM"];
signals.forEach((signal) => {
  process.on(signal, async () => {
    await app.close();
    await pool.end();
    process.exit(0);
  });
});
