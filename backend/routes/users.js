const Axios = require('axios');
const router = require('express').Router();
let User = require('../models/user.model');
require('dotenv').config();


/*router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+ err));
});*/

router.route('/signup').post((req, res) => {
    Axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=", req)
    .then(res => res.data)
    .catch(err => err);
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