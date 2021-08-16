const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    value: {
        type: Number,
        required: [true, messages.VALUE_VALIDATION],
    },
    service_type: {
        type: Number,
        required: [true, messages.TYPE_VALIDATION],
        enum: [1, 2]
    },
    charges_type: {
        type: Number,
        required: [true, messages.TYPE_VALIDATION],
        enum: [1, 2,3,4] // 1- service-charges 2- fuel charges 3- time-cost 4- waiting-charges
    },
    bellboy_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboy-type',
        required: [true, messages.BELLBOY_TYPE_VALIDATION],
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

module.exports = mongoose.model('charges', schema);