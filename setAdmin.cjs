/* eslint-disable no-undef */
// This is a Node.js script, not client-side code
// Usage: node setAdmin.js

const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = "r0w9TOu1uHfUfHMrKNVrVC221o12"; // UID de admin

admin.auth().setCustomUserClaims(uid, { role: "ADMIN" })
  .then(() => {
    console.log("✅ Role updated to ADMIN!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
