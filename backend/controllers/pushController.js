import webpush from "web-push";
import PushSubscription from "../models/PushSubscription.js";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || "mailto:admin@kixora.com",
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
    configured = true;
  }
}

export const getPublicKey = (req, res) => {
  if (!process.env.VAPID_PUBLIC_KEY) {
    return res.status(503).json({ message: "Push notifications aren't configured yet. Run `npm run generate-vapid-keys` and add the keys to .env." });
  }
  res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};

export const subscribe = async (req, res) => {
  const { endpoint, keys } = req.body;
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    return res.status(400).json({ message: "Invalid subscription payload" });
  }

  await PushSubscription.findOneAndUpdate(
    { endpoint },
    { endpoint, keys, user: req.user?._id || null },
    { upsert: true, new: true }
  );

  res.status(201).json({ message: "Subscribed to push notifications" });
};

export const unsubscribe = async (req, res) => {
  await PushSubscription.deleteOne({ endpoint: req.body.endpoint });
  res.json({ message: "Unsubscribed" });
};

// Admin-only: send a notification to every subscribed device (e.g. flash sale alert)
export const broadcast = async (req, res) => {
  ensureConfigured();
  if (!configured) return res.status(503).json({ message: "VAPID keys not configured" });

  const { title, body, url } = req.body;
  const subs = await PushSubscription.find();
  const payload = JSON.stringify({ title, body, url });

  const results = await Promise.allSettled(
    subs.map((sub) =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload
      )
    )
  );

  // Clean up subscriptions that are no longer valid (410 Gone / 404)
  const deadEndpoints = results
    .map((r, i) => ({ r, sub: subs[i] }))
    .filter(({ r }) => r.status === "rejected" && [404, 410].includes(r.reason?.statusCode))
    .map(({ sub }) => sub.endpoint);

  if (deadEndpoints.length) {
    await PushSubscription.deleteMany({ endpoint: { $in: deadEndpoints } });
  }

  res.json({
    sent: results.filter((r) => r.status === "fulfilled").length,
    failed: results.filter((r) => r.status === "rejected").length,
  });
};
