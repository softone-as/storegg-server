const mongoose = require('mongoose');

let bankSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Banks name should be assigned value!'],
    },
    username: {
        type: String,
        required: [true, 'Username bank should be assigned value!'],
    },
    accountNumber: {
        type: String,
        required: [true, 'Account Number should be assigned value!'],
    },
});

module.exports = mongoose.model('Bank', bankSchema);
