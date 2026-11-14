"use strict";

async function rootRoutes(fastify) {
  fastify.get("/", async (request, reply) => {
    const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Task Tracker API</title>
      </head>
      <body>
        <h1>Task Tracker API</h1>
        <h2>Endpoints</h2>
        <ul>
          <li><code>GET /tasks</code> — вивести усі задачі</li>
          <li><code>POST /tasks</code> — створити нову задачу</li>
          <li><code>POST /tasks/&ltid&gt/done</code> — змінити статус задачі на виконано</li>
        </ul>
      </body>
    </html>`;
    reply.type("text/html").send(html);
  });
}

module.exports = rootRoutes;
