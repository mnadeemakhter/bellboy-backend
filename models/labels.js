const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    locale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locales',
        required: [true, messages.LOCALE_VALIDATION],
    },
    label: {
        type: String,
        required: [true, messages.LABEL_VALIDATION],
        unique: true,
    },
    type:{
        type:String,
        required:[true,'Type Required']
    }
})

module.exports = mongoose.model('labels', schema);