const router = require('express').Router();
let Transaction = require('../models/transaction.model');

router.route('/').get((req, res) => {
    Transaction.find().sort({"date": -1})
        .then(transactions => res.json(transactions))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/add').post((req, res) => {
    const description = req.body.description;
    const amount = Number(req.body.amount);
    const date = Date.parse(req.body.date);
    const category = req.body.category;
    const paymentType = req.body.paymentType;
    const newTransaction = new Transaction({
        //username,
        description,
        amount,
        date,
        category,
        paymentType
    });
    newTransaction.save()
        .then(() => res.json('Transaction added'))
        .catch(err => res.status(400).json('Error: ' + err));
})

router.route('/:id').get((req,res) => {
    Transaction.findById(req.params.id)
        .then(transaction => res.json(transaction))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/:id').delete((req, res) => {
    Transaction.findByIdAndDelete(req.params.id)
        .then(() => res.json('Deleted'))
        .catch(err => res.status(400).json('Error: '+ err));
});

router.route('/update/:id').post((req, res) => {
    Transaction.findById(req.params.id)
        .then(transaction => {
            //transaction.username = req.body.username;
            transaction.description = req.body.description;
            transaction.amount = Number(req.body.amount);
            transaction.date = Date.parse(req.body.date);
            transaction.category = req.body.category;
            transaction.paymentType = req.body.paymentType;
            transaction.save()
                .then(() => res.json('Updated successfully'))
                .catch(err => res.status(400).json('Error: '+ err));
        })
})

module.exports = router;