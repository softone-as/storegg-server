const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const HASH_ROUND = 10;

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

playerSchema.path('email').validate(
    async function (email) {
        try {
            const isRegistered = await this.model('Player').countDocuments({
                email,
            });
            return !isRegistered;
        } catch (error) {
            throw error;
        }
    },
    (attr) => `${attr.value} has registered!`
);

playerSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
});

module.exports = mongoose.model('Player', playerSchema);
