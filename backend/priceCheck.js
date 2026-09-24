import db from "./db.js";
import { searchListings } from "./ebay.js";
import { sendPriceAlert } from "./email.js";

function titleSimilarity(candidateTitle, referenceTitle) {
  const candidateWords = candidateTitle.toLowerCase().split(" ");
  const referenceWords = referenceTitle.toLowerCase().split(" ");

  let count = 0;

  for (const word of candidateWords) {
    if (referenceWords.includes(word)) {
      count = count + 1;
    }
  }

  return count;
}

export async function checkItemPrice(item) {
  const listings = await searchListings(item.search_term);

  if (listings.length === 0) {
    console.log(`No listings found for ${item.name}`);
    return;
  }

  // Find the listing whose title is most similar to what the user originally picked
  let bestMatch = listings[0];
  let bestScore = titleSimilarity(listings[0].title, item.reference_title);

  for (const listing of listings) {
    const score = titleSimilarity(listing.title, item.reference_title);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = listing;
    }
  }

  db.prepare("INSERT INTO price_history (item_id, price) VALUES (?, ?)").run(
    item.id,
    bestMatch.price,
  );

  console.log(
    `${item.name}: best match "${bestMatch.title}" — $${bestMatch.price} (target $${item.target_price})`,
  );

  if (bestMatch.price <= item.target_price) {
    await sendPriceAlert(
      item.email,
      item.name,
      bestMatch.price,
      item.target_price,
      bestMatch.url,
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
