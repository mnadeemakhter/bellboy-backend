const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    hours: {
        type: Number,
        default: 2
        //     required: [true, messages.NUMBER_OF_HOURS_VALIDATION]
    },
    pricePerHour: {
        type: Number,
        default: 0.0
        //    required: [true, messages.NUMBER_OF_HOURS_VALIDATION]
    },
    bellboyType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboy-type',
        //    required: [true],
    },
    amount: {
        type: Number,
        default: 0.0
    },
    totalActions:{
        type: Number,
        default: 0
    },
    actions: [{
        actionType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hiring-action-type',
            //  required: [true, messages.HIRING_ACTION_TYPE_VALIDATION],
        },
        instruction: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: false
        },
        progress:{
            type: Number,
            enum: [1, 2, 3,4],// 1- Pending, 2- InProgress, 3- Completed, 4- Cancelled
            default: 1,
        },
        isCancelled: {
            type: Boolean,
            default: false
        },
        cancelledBy: {
            type: Number,
            enum: [0, 1, 2],// 0- None, 1- By Customer, 2- By BellBoy
            default: 0,
        },
        voice_note: {
            value: {
                type: String,
                default: ''
                //     required: [true],
            },
            exists: {
                type: Boolean,
                default: false
            }
        },
        location: {
            address: {
                type: String,
                default: ''
            },
            near_by: {
                type: String,
                default: ''
            },
            geolocation: {
                latitude: {
                    type: Number,
                    default: 0.0
                },
                longitude: {
                    type: Number,
                    default: 0.0
                },
            }
        },
        bill_images: [
            {
                type: String,
            }
        ],
        images: {
            type: [String],
            default: []
        },
        start_time: {
            type: Date,
        },
        end_time: {
            type: Date,
        },
    }],
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('hiring-cart', schema);