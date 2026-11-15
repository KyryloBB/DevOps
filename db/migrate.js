"use strict";

const pool = require("./pool");

async function run() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)
    `);

    console.log("Migration completed successfully");
  } finally {
    client.release();
  }
}

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
