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
    category: {
        type: Array,
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