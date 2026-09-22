import db from "./db.js";
import { searchListings } from "./ebay.js";
import { sendPriceAlert } from "./email.js";

export async function checkItemPrice(item) {
  const listings = await searchListings(item.search_term);

  if (listings.length === 0) {
    console.log(`No listings found for ${item.name}`);
    return;
  }

  const topMatches = listings.slice(0, 3);
  const lowest = topMatches.reduce(
    (min, l) => (l.price < min.price ? l : min),
    topMatches[0],
  );

  db.prepare("INSERT INTO price_history (item_id, price) VALUES (?, ?)").run(
    item.id,
    lowest.price,
  );

  console.log(
    `${item.name}: lowest current price $${lowest.price} (target $${item.target_price})`,
  );

  if (lowest.price <= item.target_price) {
    await sendPriceAlert(
      item.email,
      item.name,
      lowest.price,
      item.target_price,
      lowest.url,
    );
    console.log(`Alert sent for ${item.name}`);
  }
}

export async function checkAllItems() {
  const items = db.prepare("SELECT * FROM tracked_items").all();

  for (const item of items) {
    try {
      await checkItemPrice(item);
    } catch (err) {
      console.error(`Failed to check ${item.name}:`, err.message);
    }
  }
}
