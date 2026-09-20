import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPriceAlert(
  toEmail,
  itemName,
  currentPrice,
  targetPrice,
  listingUrl,
) {
  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: toEmail,
      subject: `🎮 Price drop: ${itemName} is now $${currentPrice}`,
      html: `
        <h2>${itemName} dropped below your target!</h2>
        <p>Current price: <strong>$${currentPrice}</strong></p>
        <p>Your target: $${targetPrice}</p>
        ${listingUrl ? `<p><a href="${listingUrl}">View listing</a></p>` : ""}
      `,
    });
    console.log("Email sent:", result);
    return result;
  } catch (err) {
    console.error("Email failed:", err);
    throw err;
  }
}
