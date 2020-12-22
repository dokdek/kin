
const router = require('express').Router();
let User = require('../models/user.model');
require('dotenv').config();


router.route('/getCategory').post((req,res) => {
    User.findOne({username: req.body.username},(err, user) => {
        if(err){
            res.send(err);
        }else {
            console.log(user.username);
            console.log(user);
            res.json(user.categories);
        }
    });
});

router.route('/getPayment').post((req,res) => {
    console.log(req.body.username);
    User.find({username: req.body.username},(err, user) => {
        if(err){
            res.send(err);
        }else {
            res.json(user.paymentType);
        }
    });
});

router.route('/addCategory').post((req,res) => {
    User.findOne({username: req.body.username},(err, user) => {
        if(err){
            res.send(err);
        }else {
            const category = {
                category: req.body.category,
                subCategories: []
            }
            user.categories.push(category);
            user.save()
                .then(()=>res.json("Success"))
                .catch(err => res.status(400).json("Error: " + err));
        }
    })
})

router.route('/addSubCategory').post((req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        if(err){
            res.send(err);
        }else {
            console.log(user.categories[0]);
            user.categories[user.categories.findIndex((category) => category.category === req.body.category)].subCategories.push(req.body.subCategory); //Finds index of main cat, then push subcat to maincat
            user.markModified("categories"); //Due to nested object, need to specify what property was changed for mongoose to save.
            user.save()
                .then(()=>res.json("Success"))
                .catch(err=>res.status(400).json("Error: " + err));
        }
    })
})

router.route('/addPayment').post((req,res) => {
    User.findOne({username: req.body.username},(err, user) => {
        if(err){
            res.send(err);
        }else {
            const payment = {
                payment: req.body.payment,
                subPayments: []
            }
            user.paymentType.push(payment);
            user.save()
                .then(()=>res.json("Success"))
                .catch(err => res.status(400).json("Error: " + err));
        }
    })
})

router.route('/addSubPayment').post((req,res) => {
    User.findOne({username: req.body.username},(err,user) => {
        if(err){
            res.send(err);
        }else {
            console.log(user.paymentType[0]);
            user.paymentType[user.paymentType.findIndex((payment) => payment.payment === req.body.payment)].subPayments.push(req.body.subPayment); //Finds index of main cat, then push subcat to maincat
            user.markModified("paymentType")
            user.save()
                .then(()=>res.json("Success"))
                .catch(err=>res.status(400).json("Error: " + err));
        }
    })
})

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