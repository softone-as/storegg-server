const mongoose = require('mongoose');

let categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name should be assigned value!'],
    },
});

module.exports = mongoose.model('Category', categorySchema);
