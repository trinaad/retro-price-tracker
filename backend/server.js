import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import itemsRoutes from "./items.js";
import { checkAllItems } from "./priceCheck.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
app.use("/api/items", itemsRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

// Manually trigger a price check for all tracked items (real feature, not a test route)
app.post("/api/check-now", async (req, res) => {
  await checkAllItems();
  res.json({ done: true });
});

// Runs automatically every 6 hours
cron.schedule("0 */6 * * *", async () => {
  console.log("Running scheduled price check...");
  await checkAllItems();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
