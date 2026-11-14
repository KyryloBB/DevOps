"use strict";

const pool = require("../db/pool");

async function healthRoutes(fastify) {
  fastify.get("/health/alive", async () => {
    return "OK";
  });

  fastify.get("/health/ready", async (request, reply) => {
    try {
      await pool.query("SELECT 1");
      reply.code(200).send("OK");
    } catch (err) {
      reply.code(500).send("Database connection unavailable");
    }
  });
}

module.exports = healthRoutes;
