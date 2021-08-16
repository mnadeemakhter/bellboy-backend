const mongoose = require('mongoose')
const messages = require('../common/messages');
const { ID_VALIDATION } = require('../common/messages');

var schema = new mongoose.Schema({
    hiring_id: {
        type: String,
        required: [true, ID_VALIDATION]
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customers',
    },
    bellboy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboys',
    },
    hours: {
        type: Number,
        default: 1
        //     required: [true, messages.NUMBER_OF_HOURS_VALIDATION]
    },
    pricePerHour: {
        type: Number,
        default: 0.0
        //    required: [true, messages.NUMBER_OF_HOURS_VALIDATION]
    },

    bellboyType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'bellboy-type',
        //    required: [true],
    },
    amount: {
        type: Number,
        default: 0.0
    },
    security_code: {
        type: String,
    },
    status: {
        type: Number,
        default: 1,
        enum: [1, 2, 3, 4, 5,] // 1- Pending, 2- Assigned, 3- in progress, 4-  Completed, 5-Cancelled
    },
    location: {
        address: {
            type: String,
            default: ''
        },
        near_by: {
            type: String,
            default: ''
        },
        geolocation: {
            latitude: {
                type: Number,
                default: 0.0
            },
            longitude: {
                type: Number,
                default: 0.0
            },
        }
    },
    totalActions: {
        type: Number,
        default: 0
    },
    actions: [{
        actionType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'hiring-action-type',
            //  required: [true, messages.HIRING_ACTION_TYPE_VALIDATION],
        },
        instruction: {
            type: String,
            default: ''
        },
        status: {
            type: Boolean,
            default: false
        },
        progress: {
            type: Number,
            enum: [1, 2, 3, 4],// 1- Pending, 2- InProgress, 3- Completed, 4- Cancelled
            default: 1,
        },
        isCancelled: {
            type: Boolean,
            default: false
        },
        cancelledBy: {
            type: Number,
            enum: [0, 1, 2],// 0- None, 1- By Customer, 2- By BellBoy
            default: 0,
        },
        cancellationReason: {
            type: String,
            default: '',
        },
        voice_note: {
            value: {
                type: String,
                default: ''
                //     required: [true],
            },
            exists: {
                type: Boolean,
                default: false
            }
        },
        location: {
            address: {
                type: String,
                default: ''
            },
            near_by: {
                type: String,
                default: ''
            },
            geolocation: {
                latitude: {
                    type: Number,
                    default: 0.0
                },
                longitude: {
                    type: Number,
                    default: 0.0
                },
            }
        },
        bill_images: [
            {
                type: String,
            }
        ],
        images: {
            type: [String],
            default: []
        },
        start_time: {
            type: Date,
        },
        end_time: {
            type: Date,
        },
    }],
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
    closing_reason: {
        type: String,
        default: '',
    },
    cancelled_by: {
        type: Number,
        enum: [0, 1, 2, 3],// 0- None, 1- By Customer, 2- By BellBoy. 3- By Admin
        default: 0,
    },
    cancellation_admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admins',
    },
    cancellation_time: {
        type: Date,
    },
    for_verification: {
        type: Boolean,
        default: false
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
        billingTime: {
            type: Number,
            default: 0.0,
        },
        hours: {
            type: Number,
            default: 0.0,
        },
        minutes: {
            type: Number,
            default: 0.0,
        },
        graceTime: {
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
        paidByWallet: {
            type: Number,
            default: 0.0,
        }
    },
    feedback: {
        message: {
            type: String,
            default: ''
        },
        level: {
            type: Number,
            enum: [1, 2, 3, 4, 5] // 1- Low, 2- Moderate, 3- Medium, 4- Good, 5- Excellent
        }
    },
    hasFeedback: {
        type: Boolean,
        default: false,
    },
    isFree:{
        type:Boolean,
        default:false,
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    });

module.exports = mongoose.model('hirings', schema);