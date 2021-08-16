const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    bellboy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboys',
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

module.exports = mongoose.model('bellboy_activity', schema);