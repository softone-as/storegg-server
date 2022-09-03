const mongoose = require('mongoose');

let playerSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name should be assigned value!'],
        },
        username: {
            type: String,
            required: [true, 'Username should be assigned value!'],
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
            default: 'user',
        },
        status: {
            type: String,
            enum: ['Y', 'N'],
            default: 'Y',
        },
        avatar: {
            type: String,
        },
        fileName: {
            type: String,
        },
        phoneNumber: {
            type: String,
            required: [true, 'Phone number should be assigned value!'],
            maxlength: [13, 'User account should be 9-13 character'],
            minlength: [9, 'User account should be 9-13 character'],
        },
        favorit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Player', playerSchema);
