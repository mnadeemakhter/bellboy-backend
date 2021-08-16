const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');
const messages = require('../common/messages');
const double = require('@mongoosejs/double');
var schema = new mongoose.Schema({
    name: {
        type: String,
        default: 'Anonymous',
        required: false,
    },
    email: {
        type: String,
        default: '',
        required: false,
    },
    mobile: {
        type: String,
        required: [true, messages.MOBILE_VALIDATION],
        unique: true,
    },
    birth_date: {
        type: Date,
    },
    gender: {
        type: String,
        default: 'not specified',
        enum: ['male', 'female', 'not specified']
    },
    avatar: {
        exists: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: '',
        }
    },
    fcm_token: {
        type: String,
        default: ''
    },
    auth_token: {
        type: String,
        default: ''
    },
    referral_code: {
        type: String,
        default: ''
    },
    isReferred: {
        type: Boolean,
        default: false
    },
    is_logged: {
        type: Boolean,
        default: false,
    },
    gmail_id: {
        type: String,
        default: ''
    },
    facebook_id: {
        type: String,
        default: ''
    },
    status: {
        type: Boolean,

        default: true,
    },
    wallet: {
        type: Number,
        default: 0.0,
    },
    addresses: [{
        // building_no: {
        //     type: String,
        //     required: [true, messages.BUILDING_NUMBER_VALIDATION]
        // },
        title: {
            type: String,
            required: [true, messages.NAME_VALIDATION]
        },
        contact_number: {
            type: String,
            required: [true, messages.CONTACT_NUMBER_VALIDATION]
        },
        address: {
            type: String,
            required: [true, messages.ADDRESS_VALIDATION]
        },

        near_by: {
            type: String,
            required: false,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Double,
                required: [true, messages.LATITUDE_VALIDATION]
            },
            longitude: {
                type: Double,
                required: [true, messages.LONGITUDE_VALIDATION]
            },
        }
    }],
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
    total_logins: {
        type: Number,
        default: 1,
    },
    total_hirings: {
        type: Number,
        default: 0.0,
    },
    total_spend: {
        type: Number,
        default: 0.0,
    },
    last_active: {
        type: Date,
    },
    last_seen: {
        type: Date,
    },
    current_device: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    },
    signup_device: {
        type: Number,
        default: 0,
        enum: [0, 1, 2]
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        },
    });

// schema.post('save', (error, doc, next) => {
//     if (error.name == 'MongoError' && error.code === 11000) {
//         next(new Error('Contact Number Already Exists'))
//     }
//     else {
//         next(error);
//     }
// })

module.exports = mongoose.model('customers', schema);