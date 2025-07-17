const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json")),
  databaseURL: "https://your-database-name.firebaseio.com",
});

async function setAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`✅ Admin role assigned to UID: ${uid}`);
}

// Replace with actual admin UID
setAdmin("KBZt48s4O7WmJaWFAAzYLroGret2");
