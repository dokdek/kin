const router = require('express').Router();
const Axios = require('axios');
const admin = require('../admin/firebase-admin');
const jwt = require('jsonwebtoken');
const cookie = require('cookie-parser');
let User = require('../models/user.model');


router.route('/login').post((req,res) => {
    console.log(req.body);
    Axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.FIREBASE_API, req.body)
        .then((response) => {
            //TODO: send localId back to client along with refresh token.
            const token = jwt.sign({
                username: response.data.localId
            }, process.env.TOKEN_SECRET, {expiresIn: '1 hour'});
            res.cookie('token',token,{httpOnly: true});
            res.json(token);
        })
        .catch(error => {
            if (error.response) {
              console.log(error.response.data);
              res.status(400).send(error.response.data);
            } else if (error.request) {
              console.log(error.request);
            } else {
              console.log("Error", error.message);
            } 
          });
})

router.route('/signup').post((req, res) => {
      admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          const username = userRecord.uid;
          const categories = [];
          const newUser = new User({
            username,
            categories
          })
          newUser.save()
          .then(() => res.json("Success"))
          .catch(err => res.status(400).json("Error: " + err));
          res.json(userRecord.uid);
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
        });      
});

module.exports = router;