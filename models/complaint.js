const mongoose_delete = require('mongoose-delete');
const mongoose = require('mongoose')
const messages = require('../common/messages')


var schema = new mongoose.Schema({
    subject: {
        type: String,
        required: [true, messages.TITLE_VALIDATION],
    },
    email: {
        type: String,
        required: [true, messages.EMAIL_VALIDATION],
    },
    message: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION],
    },
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, messages.CUSTOMER_ID_VALIDATION],
    },
    d1:{
        type:Date,
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

schema.plugin(mongoose_delete,{deletedAt:true,deletedBy:true,overrideMethods:"all" });
module.exports = mongoose.model('complaints', schema);