import { useEffect, useState } from "react";
import api from "../services/api.js";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function PushNotificationOptIn() {
  const [status, setStatus] = useState("idle"); // idle | subscribed | unsupported | denied
  const supported = "serviceWorker" in navigator && "PushManager" in window;

  useEffect(() => {
    if (!supported) { setStatus("unsupported"); return; }
    navigator.serviceWorker.ready.then(async (reg) => {
      const existing = await reg.pushManager.getSubscription();
      if (existing) setStatus("subscribed");
    });
  }, [supported]);

  const handleEnable = async () => {
    if (!supported) return;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") { setStatus("denied"); return; }

    try {
      const { data } = await api.get("/push/vapid-public-key");
      const reg = await navigator.serviceWorker.ready;
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(data.publicKey),
      });
      await api.post("/push/subscribe", subscription.toJSON());
      setStatus("subscribed");
    } catch (err) {
      console.error("Push subscription failed:", err);
      setStatus("idle");
    }
  };

  if (status === "unsupported" || status === "subscribed") return null;

  return (
    <button
      onClick={handleEnable}
      className="hidden md:inline-flex items-center gap-1.5 border border-steeldim rounded px-3 py-2 text-xs hover:border-volt hover:text-volt transition-colors"
    >
      🔔 {status === "denied" ? "Notifications blocked" : "Enable Notifications"}
    </button>
  );
}
