const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
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

module.exports = mongoose.model('admin_activity', schema);