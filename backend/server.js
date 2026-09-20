import "dotenv/config";
import express from "express";
import cors from "cors";
import db from "./db.js";
import itemsRoutes from "./items.js";
import { sendPriceAlert } from "./email.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
app.use("/api/items", itemsRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend running", db: "connected" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
// Temporary test route
app.get("/test-email", async (req, res) => {
  try {
    await sendPriceAlert(
      "trinaadchowdary@gmail.com", // put YOUR actual email here — the one you signed up to Resend with
      "PS2 Slim",
      45,
      50,
      "https://ebay.com",
    );
    res.json({ sent: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
