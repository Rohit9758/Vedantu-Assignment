const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    userId: { type: String },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: { type: String, required: true },
    birthDate: { type: String },
    creationDate: { type: Date, default: Date.now },
    isAdmin: { type: Boolean },
    isSeller: { type: Boolean },
    isCustomer: { type: Boolean },
    isShipper: { type: Boolean }
});

module.exports = mongoose.model('Account', accountSchema);