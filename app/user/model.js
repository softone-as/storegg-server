const mongoose = require('mongoose');

let userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be assigned value!'],
        },
        email: {
            type: String,
            required: [true, 'Email should be assigned value!'],
        },
        password: {
            type: String,
            required: [true, 'Password should be assigned value!'],
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'admin',
        },
        status: {
            type: String,
            enum: ['Y', 'N'],
            default: 'Y',
        },
        phoneNumber: {
            type: Number,
            required: [true, 'Phone number should be assigned value!'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
