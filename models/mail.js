const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
    },
    email: {
        type: String,
        required: [true, messages.EMAIL_VALIDATION],
    },
    message: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION],
    },
    type:{
        type:Number,
        required: [true, messages.IMAGE_VALIDATION],
    }
})

module.exports = mongoose.model('mail', schema);