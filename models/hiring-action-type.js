const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
        unique: true,
    },
    description: {
        type: String,
        required: [true, messages.DESCRIPTION_VALIDATION],
    },
    icon: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION],
    },
    hasLocation:{
        type: Boolean,
        default:true
    },
    labels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'labels',
        required: [true, messages.LABEL_REQUIRED]
    }],
    locales: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'locales',
        required: [true, messages.LOCALE_VALIDATION]
    }],
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

module.exports = mongoose.model('hiring-action-type', schema);