const admin = require("firebase-admin");    
const serviceAccount = require("./serviceAccKey.json");

var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kin-proj.firebaseio.com"
});

module.exports = firebaseAdmin;

