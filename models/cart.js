const mongoose = require('mongoose')
const messages = require('../common/messages')
const Double = require('@mongoosejs/double');
var schema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, messages.CUSTOMER_ID_VALIDATION],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        // required: [true, messages.CATEGORY_ID_VALIDATION],
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'brands'
        },
        image: {
            value: {
                type: String,
                default: '',
            },
            exists: {
                type: Boolean,
                default: false,
            }
        },
        quantity: {
            type: Number,
            default: 1,
        },
    }],
    deliveryAddress: {
        // building_no: {
        //     type: String,
        //     required: [true, messages.BUILDING_NUMBER_VALIDATION]
        // },
        title: {
            type: String,
            default: ''
        },
        contact_number: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        near_by: {
            type: String,
            required: false,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Double,
                default: 0.0
            },
            longitude: {
                type: Double,
                default: 0.0
            },
        }
    },
    pickUpAddress: {
        // building_no: {
        //     type: String,
        //     required: [true, messages.BUILDING_NUMBER_VALIDATION]
        // },
        title: {
            type: String,
            default: ''
        },
        contact_number: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        near_by: {
            type: String,
            required: false,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Double,
                default: 0.0
            },
            longitude: {
                type: Double,
                default: 0.0
            },
        }
    },
    hasPickUp: {
        type: Boolean,
        default: false,
    },
    hasDelivery: {
        type: Boolean,
        default: false,
    },
    voice_note: {
        value: {
            type: String,
            default: '',
        },
        exists: {
            type: Boolean,
            default: false,
        }
    },
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    })

module.exports = mongoose.model('cart', schema);