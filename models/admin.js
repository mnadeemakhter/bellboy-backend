const mongoose = require('mongoose')
const messages = require('../common/messages')

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
    contact_number: {
        type: String,
        required: [true, messages.CONTACT_NUMBER_VALIDATION],
    },
    password: {
        type: String,
        required: [true, messages.PASSWORD_VALIDATION],
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
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'role',
        required: [true, messages.ROLE_ID_REQUIRED],
    },
    status: {
        type: Boolean,
        default: true,
    },
    is_logged: {
        type: Boolean,
        default: false,
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
    })
schema.post('save', (error, doc, next) => {
    if (error.name == 'MongoError' && error.code === 11000) {
        next(new Error('Email Already Exists'))
    }
    else {
        next(error);
    }
})
module.exports = mongoose.model('admins', schema);