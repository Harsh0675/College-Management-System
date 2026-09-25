import express from "express";
import cors from "cors";
import crypto from "crypto";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const isProduction = process.env.NODE_ENV === "production";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("CORS origin not allowed"));
    },
  })
);

// Razorpay webhook must receive the raw body for HMAC verification.
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

      if (!signature || !secret) {
        return res.status(400).json({ ok: false, error: "Missing webhook signature or secret" });
      }

      const expected = crypto
        .createHmac("sha256", secret)
        .update(req.body)
        .digest("hex");

      const valid =
        expected.length === String(signature).length &&
        crypto.timingSafeEqual(
          Buffer.from(expected),
          Buffer.from(String(signature))
        );

      if (!valid) {
        return res.status(400).json({ ok: false, error: "Invalid webhook signature" });
      }

      const event = JSON.parse(req.body.toString("utf8"));
      console.log("Razorpay webhook received:", event.event);

      // Persist webhook events in a database here when database persistence is added.
      return res.json({ ok: true });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.status(400).json({ ok: false, error: "Invalid webhook payload" });
    }
  }
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    ok: true,
    service: "college-management-payment-api",
    razorpayConfigured: Boolean(
      process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
    ),
  });
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/payments/create-order", async (req, res) => {
  try {
    const { amount, receipt, notes } = req.body;
    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      return res.status(400).json({ error: "Invalid payment amount" });
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: "Razorpay is not configured on the server" });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(numericAmount * 100),
      currency: "INR",
      receipt: receipt || `fee_${Date.now()}`,
      notes: notes || {},
    });

    return res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({ error: "Unable to create payment order" });
  }
});

app.post("/api/payments/verify", (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        verified: false,
        error: "Missing payment verification data",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        verified: false,
        error: "Razorpay is not configured on the server",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    const provided = String(signature);
    const verified =
      expectedSignature.length === provided.length &&
      crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(provided)
      );

    if (!verified) {
      return res.status(400).json({
        verified: false,
        error: "Invalid payment signature",
      });
    }

    return res.json({
      verified: true,
      orderId,
      paymentId,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      verified: false,
      error: "Payment verification failed",
    });
  }
});

// Serve the built React app from the same Render service.
if (isProduction) {
  const distPath = path.resolve(__dirname, "../dist");
  app.use(express.static(distPath));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.listen(PORT, "0.0.0.0", () => {
  console.log(`College Management backend running on port ${PORT}`);
});
