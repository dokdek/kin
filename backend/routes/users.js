const router = require('express').Router();
let User = require('../models/user.model');
const admin = require('../admin/admin');
const { route } = require('./transactions');


router.route('/').get((req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/add').post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    firebase.auth().createUserWithEmailAndPassword(username,password).catch((err) => {
        var errorCode = error.code; //firebase error
        var errorMsg = error.message; //firebase msg
        console.log(error);
    })
    /*const newUser = new User({username});
    newUser.save()
        .then(() => res.json('User added'))
        .catch(err => res.status(400).json('Error: ' + err));*/
})

router.route('/:id').get((req,res) => {
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
});

module.exports = router;