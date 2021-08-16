const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
        unique: true,
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labels',
        required: [true, messages.LABEL_REQUIRED]
    }],
    // departments: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'department',
    // }],
    locales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locales',
        required: [true, messages.LOCALE_VALIDATION]
    }],
    icon: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION],
    },
    status: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('category', schema);