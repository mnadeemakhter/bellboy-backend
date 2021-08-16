const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    track:[{
        date:{
            type:Date,
        },
        start:{
            type:Date,
        },
        end:{
            type:Date,
        }
    }]
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('customer_activity', schema);