/*import firebase from 'firebase/app';
require('dotenv').config();


const config = {
    apiKey: process.env.FIREBASE_API,
    authDomain: "kin-proj.firebaseapp.com",
    databaseURL: "https://kin-proj.firebaseio.com",
    credential: admin.credential.cert(process.env.FIREBASE_ADMIN),
    projectId: "kin-proj",
    storageBucket: "kin-proj.appspot.com",
    messagingSenderId: process.env.FIREBASE_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
 };

 firebase.initializeApp(config);

 export default firebase;*/

var admin = require("firebase-admin");    
var serviceAccount = require("./serviceAccKey.json");

var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://kin-proj.firebaseio.com"
});

module.exports = firebaseAdmin;

