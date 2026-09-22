import express from "express";
import db from "./db.js";
import { searchListings } from "./ebay.js";

const router = express.Router();

// Get all tracked items
router.get("/", (req, res) => {
  const items = db
    .prepare(
      `
    SELECT
      ti.*,
      (SELECT price FROM price_history WHERE item_id = ti.id ORDER BY checked_at DESC LIMIT 1) as last_price,
      (SELECT checked_at FROM price_history WHERE item_id = ti.id ORDER BY checked_at DESC LIMIT 1) as last_checked
    FROM tracked_items ti
    ORDER BY ti.created_at DESC
  `,
    )
    .all();
  res.json(items);
});

router.get("/search-preview/:term", async (req, res) => {
  try {
    const results = await searchListings(req.params.term);
    res.json(results.slice(0, 5)); // just show top 5 for preview
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
