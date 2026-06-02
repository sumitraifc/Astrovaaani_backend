const admin = require("firebase-admin");

const serviceAccount = require("./atrovaaaniuser-firebase-adminsdk-fbsvc-525860ba1d.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;