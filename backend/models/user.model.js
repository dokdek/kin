const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: true,
        trim: true
    },
    budget: {
        type: Array,
        unique: true
    },
    categories: {
        type: Array,
        unique: true
    },
    paymentType: {
        type: Array,
        unique: true
    },
    transactions: {
        type: Array,
        unique: true,
        //timestamps: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;