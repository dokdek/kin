const router = require("express").Router();
const Axios = require("axios");
const admin = require("../admin/firebase-admin");
const jwt = require("jsonwebtoken");
let User = require("../models/user.model");

router.route("/login").post((req, res) => {
  console.log(req.body);
  Axios.post(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
      process.env.FIREBASE_API,
    req.body
  )
    .then((response) => {
      //TODO: send localId back to client along with refresh token.
      const token = jwt.sign(
        {
          username: response.data.localId,
        },
        process.env.TOKEN_SECRET,
        { expiresIn: "1 hour" }
      );
      res.cookie("token", token, { httpOnly: true });
      res.json(token);
      console.log(token);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        res.status(400).send(error.response.data);
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log("Error", error.message);
      }
    });
});

router.route("/signup").post((req, res) => {
  if (req.body.email != null && req.body.password != null) {
    admin
      .auth()
      .createUser({
        email: req.body.email,
        password: req.body.password,
      })
      .then(function (userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        console.log("Successfully created new user:", userRecord.uid);
        const username = userRecord.uid;
        const newUser = new User({
          username: username,
          categories: [],
          paymentType: [],
          transactions: []
        });
        newUser.save();
        res.json(userRecord.uid);
      })
      .catch(function (error) {
        console.log("Error creating new user:", error);
      });
  } else {
    res.json("Failed");
  }
});

module.exports = router;
