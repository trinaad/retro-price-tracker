let cachedToken = null;
let tokenExpiry = 0;

async function getEbayToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(
    "https://api.ebay.com/identity/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${credentials}`,
      },
      body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
    },
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(
      `eBay auth failed: ${data.error_description || data.error}`,
    );
  }

  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000; // refresh 1 min early

  return cachedToken;
}

export async function searchListings(searchTerm) {
  const token = await getEbayToken();

  const url = `https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(searchTerm)}&category_ids=1249&limit=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
    },
  });

  const data = await response.json();

  if (!data.itemSummaries) return [];

  return data.itemSummaries.map((item) => ({
    title: item.title,
    price: parseFloat(item.price.value),
    currency: item.price.currency,
    url: item.itemWebUrl,
    condition: item.condition,
  }));
}
