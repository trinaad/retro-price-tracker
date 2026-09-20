# retro-price-tracker

I'm into retro consoles and like keeping an eye on what things go for, but manually checking eBay every day is tedious. So I'm building a small tool that watches prices for me and pings me when something interesting shows up.

## the idea

Add something you want to keep tabs on — a PS2 Slim, a specific game, whatever — set a price you'd consider a good deal, and forget about it. In the background, it checks real listings on a schedule and emails you the moment something matches. No dashboard to babysit, no manual searching.

## where it's at right now

The plumbing works. You can add items, they persist in a real database, and email alerts are confirmed firing correctly — tested end to end against my own inbox. What's missing is the actual eyes-on-the-marketplace part: that's sitting behind an eBay Developer API approval that takes a business day or two to clear.

So right now it's a fully working item tracker with a manual test-email button standing in for what will become an automatic price check.

**Working:**

- Add / view / delete tracked items, stored in SQLite
- Email alerts via Resend — tested end to end
- Angular dashboard, dark themed

**Not yet:**

- Real price data (waiting on eBay API access)
- Scheduled automatic checking
- Price history over time

## stack

Node + Express on the backend, SQLite for storage, Resend for email, Angular on the frontend. eBay's Browse API once it's approved. node-cron for scheduling once there's something worth scheduling.

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

if you're also into retro gaming and this sounds useful, feel free to star it — updates coming as the eBay integration lands.
