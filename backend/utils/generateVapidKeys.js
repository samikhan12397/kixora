import webpush from "web-push";

const keys = webpush.generateVAPIDKeys();

console.log("\nAdd these to your backend .env file:\n");
console.log(`VAPID_PUBLIC_KEY=${keys.publicKey}`);
console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`);
console.log("\nThese are generated locally — no external account needed.\n");
