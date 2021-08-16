const mongoose = require('mongoose')
const messages = require('../common/messages')

const Double = require('@mongoosejs/double');
const double = require('@mongoosejs/double');
var schema = new mongoose.Schema({
    order_id: {
        type: String,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
        required: [true, messages.CUSTOMER_ID_VALIDATION],
    },
    bellboy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboys',
    },
    bellboyType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboy-type',
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3, 4, 5, 6, 7] // 1- Pending, 2- Assigned, 3- At PickUp Point, 4- on th way, 5-reached , 6- Completed, 7- Cancelled,

    },
    diputed_by: {
        type: Number,
        enum: [0, 1, 2], // 0- None, 1- By Customer, 2- By BellBoy
        default: 0,
    },
    is_completed: {
        type: Boolean,
        default: false,
    },
    start_time: {
        type: Date,
    },
    end_time: {
        type: Date,
    },
    cancellation_reason: {
        type: String,
        default: '',
    },
    cancelled_by: {
        type: Number,
        enum: [0, 1, 2],// 0- None, 1- By Customer, 2- By BellBoy
        default: 0,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: [true, messages.CATEGORY_ID_VALIDATION],
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'brands'
        },
        image: {
            value: {
                type: String,
                default: '',
            },
            exists: {
                type: Boolean,
                default: false,
            }
        },
        quantity: {
            type: Number,
            default: 1,
        },
        is_purchased: {
            type: Boolean,
            default: false,
        }
    }],
    deliveryAddress: {
        // building_no: {
        //     type: String,
        //     required: [true, messages.BUILDING_NUMBER_VALIDATION]
        // },
        title: {
            type: String,
            default: ''
        },
        contact_number: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        near_by: {
            type: String,
            required: false,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Double,
                default: 0.0
            },
            longitude: {
                type: Double,
                default: 0.0
            },
        }
    },
    pickUpAddress: {
        // building_no: {
        //     type: String,
        //     required: [true, messages.BUILDING_NUMBER_VALIDATION]
        // },
        title: {
            type: String,
            default: ''
        },
        contact_number: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            default: ''
        },
        near_by: {
            type: String,
            required: false,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Double,
                default: 0.0
            },
            longitude: {
                type: Double,
                default: 0.0
            },
        }
    },
    hasPickUp: {
        type: Boolean,
        default: false,
    },
    hasDelivery: {
        type: Boolean,
        default: false,
    },
    // buckets: [{
    //     store_id: {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'stores'
    //     },
    //     products: [{
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: 'products'
    //     }],
    //     bill_image: {
    //         type: String,
    //         default: '',
    //     }
    // }],
    voice_note: {
        value: {
            type: String,
            default: '',
        },
        exists: {
            type: Boolean,
            default: false,
        }
    },
    charges: {
        totalDistance: {
            type: Number,
            default: 0.0,
        },
        totalTime: {
            type: Number,
            default: 0.0,
        },
        fuelCharges: {
            calculated: {
                type: Number,
                default: 0.0,
            },
            defined: {
                type: Number,
                default: 0.0,
            }
        },
        serviceCharges: {
            calculated: {
                type: Number,
                default: 0.0,
            },
            defined: {
                type: Number,
                default: 0.0,
            }
        },
        timeCosting: {
            calculated: {
                type: Number,
                default: 0.0,
            },
            defined: {
                type: Number,
                default: 0.0,
            }
        },
        waitingCharges: {
            calculated: {
                type: Number,
                default: 0.0,
            },
            defined: {
                type: Number,
                default: 0.0,
            }
        },
        totalBill: {
            type: Number,
            default: 0.0,
        },
        amountReceived: {
            type: Number,
            default: 0.0,
        },
    },
    bill_images: [
        {
            bill:{
                type: Number,
    
            },
            image:{
                type: String,
    
            }
        }
    ]
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    })

module.exports = mongoose.model('orders', schema);