const Axios = require('axios');
const router = require('express').Router();
let User = require('../models/user.model');
const admin = require('../admin/firebase-config');
require('dotenv').config();


/*router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+ err));
});*/

router.route('/signup').post((req, res) => {
    /*Axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + process.env.FIREBASE_API, req)
    .then(response => res.json(response))
    .catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        } 
      });*/
      admin.auth().createUser({
        email: req.body.email,
        password: req.body.password,
      })
        .then(function(userRecord) {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log('Successfully created new user:', userRecord.uid);
          res.json(userRecord.uid);
        })
        .catch(function(error) {
          console.log('Error creating new user:', error);
        });
      
});

/*router.route('/:id').get((req,res) => {
    User.findById(req.params.id)
        .then(user => res.json(user))
        .catch(err => res.status(400).json('Error ' + err));
});

router.route('/update/:id').post((req,res) => {
    User.findById(req.params.id)
        .then(user => {
            user.username = req.body.username
            user.save()
                .then(() => res.json('Updated successfully'))
                .catch(err => res.status(400).json('Error ' + err));
        });
});

router.route('/delete/:id').delete((req,res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => res.json('User sucessfully deleted'))
        .catch(err => res.status(400).json('Error ' + err));
});*/

module.exports = router;