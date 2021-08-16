const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete');
const messages = require('../common/messages')


var schema = new mongoose.Schema({
   
    image: {
        type: String,
        required: [true, messages.IMAGE_VALIDATION],
    },
    status: {
        type: Boolean,
        default: false,
    },
    actionDate:{
        type:Date
    },
    title:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:""
    },
    activeBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
    },
    deActiveBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
    },
    uploadBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
    }
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

schema.plugin(mongoose_delete, { deletedBy : true,deletedAt:true ,overrideMethods:true});
module.exports = mongoose.model('advertisement', schema);