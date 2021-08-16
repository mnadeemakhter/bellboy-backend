const mongoose = require('mongoose');
const messages = require('../common/messages');
var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    hexCode: {
        type: Number,
        required: [true, messages.HEX_CODE_VALIDATION]
    },
    rgbCode: {
        r: {
            type: Number,
            required: [true, messages.R_CODE_VALIDATION]
        },
        g: {
            type: Number,
            required: [true, messages.G_CODE_VALIDATION]
        },
        b: {
            type: Number,
            required: [true, messages.B_CODE_VALIDATION]
        },
        o: {
            type: Number,
            default: 1,
        },
    },
});
module.exports = mongoose.model('colors', schema);