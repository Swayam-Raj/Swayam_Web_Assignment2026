const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "expensedb",
  user: process.env.DB_USER || "expenseuser",
  password: process.env.DB_PASSWORD || "expensepass",
});

async function initDB() {
  let retries = 10;
  while (retries > 0) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          amount NUMERIC(10,2) NOT NULL,
          category TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("✅ Database connected and table ready");
      break;
    } catch (err) {
      retries--;
      console.log(`⏳ Waiting for DB... (${retries} retries left)`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("/api/expenses", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM expenses ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const result = await pool.query(
      "INSERT INTO expenses (title, amount, category) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, category]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
