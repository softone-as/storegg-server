const mongoose = require('mongoose');

let transactionSchema = mongoose.Schema(
    {
        historyVoucherTopUp: {
            game: {
                type: String,
                required: [true, 'Game should be assigned value!'],
            },
            category: {
                type: String,
                required: [true, 'Category should be assigned value!'],
            },
            thumbnail: {
                type: String,
            },
            coinName: {
                type: String,
                required: [true, 'Coin name should be assigned value!'],
            },
            coinQuantity: {
                type: Number,
                required: [true, 'Coin quantity should be assigned value!'],
            },
            price: {
                type: Number,
                required: [true, 'Coin quantity should be assigned value!'],
            },
        },

        historyPayment: {
            username: {
                type: String,
                required: [true, 'Name should be assigned value!'],
            },
            type: {
                type: String,
                required: [true, 'Payment type should be assigned value!'],
            },
            bank: {
                type: String,
                required: [true, 'Bank should be assigned value!'],
            },
            accountNumber: {
                type: String,
                required: [true, 'Account Number should be assigned value!'],
            },
        },

        name: {
            type: String,
            required: [true, 'Name should be assigned value!'],
            maxlength: [225, 'Name should be 3-225 character'],
            minlength: [3, 'Name should be 3-225 character'],
        },

        accountUser: {
            type: String,
            required: [true, 'User account should be assigned value!'],
            maxlength: [225, 'User account should be 3-225 character'],
            minlength: [3, 'User account should be 3-225 character'],
        },

        tax: {
            type: Number,
            default: 0,
        },

        value: {
            type: Number,
            default: 0,
        },

        status: {
            type: String,
            enum: ['success', 'pending', 'failed'],
            default: 'pending',
        },

        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
        },

        historyUser: {
            name: {
                type: String,
                required: [true, 'Player name should be assigned value!'],
            },
            phoneNumber: {
                type: String,
                required: [true, 'Phone number should be assigned value!'],
                maxlength: [13, 'User account should be 9-13 character'],
                minlength: [9, 'User account should be 9-13 character'],
            },
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },

        accountUser: {
            type: String,
            required: [true, 'User account should be assigned value!'],
        },

        voucherTopUp: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Voucher',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
