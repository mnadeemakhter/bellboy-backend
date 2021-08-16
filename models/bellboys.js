const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');
const messages = require('../common/messages');
var schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, messages.NAME_VALIDATION],
    },
    email: {
        type: String,
        required: [true, messages.EMAIL_VALIDATION],
        unique: true,
    },
    mobile: {
        type: String,
        required: [true, messages.MOBILE_VALIDATION],
        unique: true,
    },
    birth_date: {
        day: {
            type: Number,
            min: [1, messages.MIN_NUMBER_VALIDATION],
            max: [31, messages.MAX_NUMBER_VALIDATION],
            required: [true, messages.DAY_VALIDATION]
        },
        month: {
            type: Number,
            min: [1, messages.MIN_NUMBER_VALIDATION],
            max: [31, messages.MAX_NUMBER_VALIDATION],
            required: [true, messages.MONTH_VALIDATION]
        },
        year: {
            type: Number,
            min: [1, messages.MIN_NUMBER_VALIDATION],
            max: [9999, messages.MAX_NUMBER_VALIDATION],
            required: [true, messages.YEAR_VALIDATION]
        }
    },
    gender: {
        type: String,
        // required: [true, messages.GENDER_VALIDATION],
        default: 'male',
        enum: ['male', 'female', 'other']
    },
    avatar: {
        exists: {
            type: Boolean,
            default: false,
        },
        value: {
            type: String,
            default: ''
        }
    },
    legals: {
        nic: {
            front_image: {
                type: String,
                default: ''
            },
            back_image: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: '',
                min: [13, messages.NIC_LENGTH_VALIDATION],
                max: [13, messages.NIC_LENGTH_VALIDATION]
            },
            expiry_date: {
                type: Date,
            },
            exists: {
                type: Boolean,
                default: false,
            },
            approval: {
                type: Number,
                default: 0,
                enum: [0, 1, 2] // 0- Pending, 1- Approved, 2- Rejected
            }
        },
        driving_license: {
            front_image: {
                type: String,
                default: ''
            },
            back_image: {
                type: String,
                default: ''
            },
            value: {
                type: String,
                default: '',
            },
            expiry_date: {
                type: Date,
            },
            exists: {
                type: Boolean,
                default: false,
            },
            approval: {
                type: Number,
                default: 0,
                enum: [0, 1, 2] // 0- Pending, 1- Approved, 2- Rejected
            }
        },
        character_certificate:{
            image:{
                type:String,
                default:""
            },
            date_of_issue:{
                type:Date,                
            },
            exists:{
                type:Boolean,
                default:false
            },
            no:{
                type:String,
                default:""
            },
            approval: {
                type: Number,
                default: 0,
                enum: [0, 1, 2] // 0- Pending, 1- Approved, 2- Rejected
            }
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
    bellboyType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboy-type',
        //    required: [true],
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
        type: Number,
        enum: [0, 1, 2, 3],
        // status 3 is for block a bellboy
        default: 0,
    },
    working_status: {
        type: Boolean,
        default: false,
    },
    is_busy: {
        type: Boolean,
        default: false,
    },
    active_for: {
        type: Number,
        enum: [1, 2, 3],
        default: 3
    },
    busy_in: {
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    total_working_hours: {
        type: Number,
        default: 0.0,
    },
    total_hirings: {
        type: Number,
        default: 0,
    },
    total_earnings: {
        type: Number,
        default: 0.0,
    },
    last_active: {
        type: Date,
        default: Date.now
    },
    last_seen: {
        type: Date,
    },
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

module.exports = mongoose.model('bellboys', schema);