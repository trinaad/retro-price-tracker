import express from "express";
import db from "./db.js";

const router = express.Router();

// Get all tracked items
router.get("/", (req, res) => {
  const items = db
    .prepare("SELECT * FROM tracked_items ORDER BY created_at DESC")
    .all();
  res.json(items);
});

// Add a new tracked item
router.post("/", (req, res) => {
  const { name, search_term, target_price, email } = req.body;

  if (!name || !search_term || !target_price || !email) {
    return res.status(400).json({
      error: "name, search_term, target_price, and email are required",
    });
  }

  const stmt = db.prepare(
    "INSERT INTO tracked_items (name, search_term, target_price, email) VALUES (?, ?, ?, ?)",
  );
  const result = stmt.run(name, search_term, target_price, email);

  res.json({
    id: result.lastInsertRowid,
    name,
    search_term,
    target_price,
    email,
  });
});
router.post("/", (req, res) => {
  const { name, search_term, target_price, email } = req.body;

  if (!name || !search_term || !target_price || !email) {
    return res.status(400).json({
      error: "name, search_term, target_price, and email are required",
    });
  }

  const stmt = db.prepare(
    "INSERT INTO tracked_items (name, search_term, target_price, email) VALUES (?, ?, ?, ?)",
  );
  const result = stmt.run(name, search_term, target_price, email);

  res.json({
    id: result.lastInsertRowid,
    name,
    search_term,
    target_price,
    email,
  });
});

// Delete a tracked item
router.delete("/:id", (req, res) => {
  db.prepare("DELETE FROM price_history WHERE item_id = ?").run(req.params.id);
  db.prepare("DELETE FROM tracked_items WHERE id = ?").run(req.params.id);
  res.json({ deleted: true });
});

export default router;
