const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let Transaction = require('../models/transaction.model');

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: true,
        trim: true
    },
    categories: {
        type: Array,
        required: true,
        minlength: true,
        trim: true,
        unique: true
    },
    transactions: {
        type: String,
        required: true,
        minlength: true,
        trim: true,
        unique: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;