const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const transactionSchema = new Schema ({
    //username: { type: String, required: true},
    description: {type: String, required: true},
    amount: {type: Number, required: true},
    date: {type: Date, required: true},
    //categeory: {type: String, required: true},
    //paymentType: {type: String, required: true}
}, {
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;