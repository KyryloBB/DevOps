"use strict";

const pool = require("../db/pool");

function getAcceptType(request) {
  const accept = request.headers.accept || "";
  if (accept.includes("text/html")) return "html";
  return "json";
}

function escapeHtml(unsafe) {
  if (unsafe == null) return "";
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function tasksListHtml(rows) {
  const rowsHtml = rows.map(task => {
    const doneButton = task.status === "done"
      ? "<button disabled>Виконане</button>"
      : `<form action="/tasks/${escapeHtml(task.id)}/done" method="POST" style="display:inline;"><button type="submit">Виконане</button></form>`;
    return `<tr>
              <td>${escapeHtml(task.id)}</td>
              <td>${escapeHtml(task.title)}</td>
              <td>${escapeHtml(task.status)}</td>
              <td>${escapeHtml(task.created_at)}</td>
              <td>${doneButton}</td>
            </tr>`;
  }).join("\n");
  return `<!DOCTYPE html>
  <html>
    <head> 
      <meta charset="utf-8"><title>Tasks</title></head>
    <body>
      <h1>Завдання</h1>

      <form action="/tasks" method="POST">
        <label for="title">Назва:</label>
        <input type="text" id="title" name="title" required>
        <button type="submit">Створити завдання</button>
      </form>

      <table border="1">
        <thead>
          <tr>
            <th>id</th>
            <th>Назва</th>
            <th>Статус</th>
            <th>Час створення</th>
            <th>Позначити як виконане</th>
          </tr>
        </thead>
        <tbody>${rowsHtml}</tbody>
      </table>
    </body>
  </html>`;
}

async function tasksRoutes(fastify) {
  fastify.get("/tasks", async (request, reply) => {
    const { rows } = await pool.query(
      "SELECT id, title, status, created_at FROM tasks ORDER BY created_at DESC"
    );

    if (getAcceptType(request) === "html") {
      reply.type("text/html").send(tasksListHtml(rows));
    } else {
      reply.type("application/json").send(rows);
    }
  });

  fastify.post("/tasks", async (request, reply) => {
    const title = request.body?.title ?? request.query.title;
    if (!title) {
      reply.code(400).send({ error: "title is required" });
      return;
    }

    const { rows } = await pool.query(
      "INSERT INTO tasks (title) VALUES ($1) RETURNING id, title, status, created_at",
      [title]
    );

    const task = rows[0];
    if (getAcceptType(request) === "html") {
      reply.redirect("/tasks");
    } else {
      reply.code(201).type("application/json").send(task);
    }
  });

  fastify.post("/tasks/:id/done", async (request, reply) => {
    const id = request.params.id;
    const { rows } = await pool.query(
      "UPDATE tasks SET status = 'done' WHERE id = $1 RETURNING id, title, status, created_at",
      [id]
    );

    if (rows.length === 0) {
      reply.code(404).send({ error: "task not found" });
      return;
    }

    const task = rows[0];
    if (getAcceptType(request) === "html") {
      reply.redirect("/tasks");
    } else {
      reply.type("application/json").send(task);
    }
  });
}

module.exports = tasksRoutes;
