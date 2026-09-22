# retro-price-tracker

I'm into retro consoles and like keeping an eye on what things go for, but manually checking eBay every day is tedious. So I built a small tool that watches prices for me and emails me the moment something worth looking at shows up.

## the idea

Add something you want to keep tabs on — a PS2 Slim, a specific game, whatever — set a price you'd consider a good deal, and forget about it. In the background, it checks real eBay listings on a schedule and emails you the moment something matches. No dashboard to babysit, no manual searching.

Before you commit to a target price, you can also see live current listings right in the add-item form — so you're setting a realistic number instead of guessing blind.

## where it's at

Fully working end to end. You can add items, see real live eBay prices while typing, and the tool checks them automatically every 6 hours — or on demand with a "refresh" button. When something drops below your target, a real email lands in your inbox.

**Working:**

- Live search preview against real eBay listings before you set a target
- Results filtered to the actual Video Games & Consoles category, so junk like cables, faceplates, or unrelated accessories don't sneak in
- Add / view / delete tracked items, stored in SQLite
- Price history saved on every check, shown as "last seen" on each item
- Email alerts via Resend, correctly firing only when the price is actually at or below target
- Automatic checking every 6 hours via a scheduled job, plus a manual refresh option
- No login required — just a one-time email prompt stored locally in your browser

## stack

Node + Express on the backend, SQLite for storage, Resend for email, node-cron for scheduling, Angular on the frontend, and eBay's Browse API for real listing data.

## running it locally

```bash
git clone https://github.com/trinaad/retro-price-tracker.git
cd retro-price-tracker
```

Backend:

```bash
cd backend
npm install
```

Drop a `.env` in `backend/` with:

```
RESEND_API_KEY=your_resend_key
EBAY_CLIENT_ID=your_ebay_client_id
EBAY_CLIENT_SECRET=your_ebay_client_secret
PORT=3001
```

```bash
npm run dev
```

Frontend:

```bash
cd ../frontend
npm install
ng serve
```

Open `localhost:4200`.

---

if you're also into retro gaming and this sounds useful, feel free to star it.
