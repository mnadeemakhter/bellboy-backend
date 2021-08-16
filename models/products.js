const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
        unique: true,
    },

    brands: [
        {
            active: {
                type: Boolean,
                default: true,
            },
            brand: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'brands',
            }
        }
    ],
    categories: [
        {
            active: {
                type: Boolean,
                default: true,
            },
            category: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'category',
            }
        }
    ],
    // categories: [
    //     {
    //         category: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'category',

    //         },
    //         department: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'department',
    //         },
    //     }
    // ],
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

module.exports = mongoose.model('products', schema);