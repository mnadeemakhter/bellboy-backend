const mongoose = require('mongoose')

var schema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    contactNo: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })
module.exports = mongoose.model('BecomeBellBoy', schema);