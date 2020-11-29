const Axios = require('axios');
const router = require('express').Router();
let User = require('../models/user.model');
const admin = require('../admin/firebase-admin');
const jwt = require('jsonwebtoken');
require('dotenv').config();


router.route('/secretTest').get((req, res) => {
    res.json("ok");
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