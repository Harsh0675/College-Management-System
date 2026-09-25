# Render + Razorpay setup

## 1. Deploy
Create a Render Web Service from this repository.

Build command:
`npm install && npm run build`

Start command:
`npm start`

The service starts the Express server from `server/payment.js` and serves the built React app from `dist`.

## 2. Add Render environment variables
Set these in Render, not in GitHub:

- `NODE_ENV=production`
- `RAZORPAY_KEY_ID=...`
- `RAZORPAY_KEY_SECRET=...`
- `RAZORPAY_WEBHOOK_SECRET=...`
- `ALLOWED_ORIGINS=` (leave empty when frontend and API are on the same Render service)

Do not commit real Razorpay secrets.

## 3. Test
Open:
`https://YOUR-RENDER-DOMAIN/health`

The response should include `"ok": true`.

Then open the website and start a fee payment. Razorpay Checkout handles the card/UPI/net-banking entry.

## 4. Webhook
In Razorpay Dashboard, configure a webhook URL:

`https://YOUR-RENDER-DOMAIN/api/payments/webhook`

Use the same value as `RAZORPAY_WEBHOOK_SECRET` in Render.

## Important
The gateway verification is server-side. The current application still keeps its student/invoice/transaction UI state in browser localStorage. For a production college system, add a database (such as Render Postgres) and persist verified payments server-side before treating the payment ledger as authoritative.
