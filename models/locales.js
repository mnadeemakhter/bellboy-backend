const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
        unique: true,
    },
    code: {
        type: String,
        required: [true, messages.LOCALE_CODE_VALIDATION],
        unique: true,
    }
})

module.exports = mongoose.model('locales', schema);