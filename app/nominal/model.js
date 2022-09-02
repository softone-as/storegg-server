const mongoose = require('mongoose');

let nominalSchema = mongoose.Schema({
    coinQuantity: {
        type: Number,
        default: 0,
    },
    coinName: {
        type: String,
        required: [true, 'Coin name should be assigned value!'],
    },
    price: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Nominal', nominalSchema);
