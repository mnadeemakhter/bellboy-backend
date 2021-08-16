const mongoose = require('mongoose')
const messages = require('../common/messages')

const schema = new mongoose.Schema({
    vehicleType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle_types'
    },
    vehicleBrand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle_brands'
    },
    vehicleModel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'vehicle_models'
    },
    color: {
        type: String,
        enum: ['RED', 'GREEN', 'BLUE', 'WHITE', 'BLACK', 'GOLDEN', 'YELLOW', 'ORANGE', 'VOILET', 'PINK', 'PURPLE']
    },
    vehicle_images: {
        front_image: {
            type: String,
            default: ''
        },
        back_image: {
            type: String,
            default: ''
        },
        right_image: {
            type: String,
            default: ''
        },
        left_image: {
            type: String,
            default: ''
        },
    },
    plate: {
        plate_number: {
            type: String,
            default: '',
        },
        plate_image: {
            type: String,
            default: ''
        },
        exists: {
            type: Boolean,
            default: false,
        }
    },
    bellboy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboys'
    },
    isActive: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: true
    },
    approval: {
        type: Number,
        default: 0,
        enum: [0, 1, 2] // 0- Pending, 1- Approved, 2- Rejected
    },
    vehicle_reg_images:{
        front_image: {
            type: String,
            default: ''
        },
        back_image: {
            type: String,
            default: ''
        },
        other_image: {
            type: String,
            default: ''
        },
    },
    engine_no:{
        type:String,
        default:""
    },
    registration_year:{
        type:String,
        default:""
    },
    owner:{
        type:String,
        default:""
    }


}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});
module.exports = mongoose.model('vehicles', schema);