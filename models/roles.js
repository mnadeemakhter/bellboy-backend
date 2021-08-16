const mongoose = require('mongoose')
const messages = require('../common/messages')

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, messages.TITLE_VALIDATION]
    },
    permissions: {
        type: [String],
        enum:["Dashboard","Hiring","Customers","Bellboy Tracking","Manage Bellboy","Bellboy Types","Manage Vehicles","Manage Vehicles Type","Manage Brand","Manage Model","Complaints","Finance Reports","Monitoring Reports","User Management","Roles Management","Advertisement","Notification","Hiring Charges","Hiring Action Types", "Version Control"],
        // enum: ["Dashboard", "Hiring", "Customers", "Bellboy Tracking", "Manage Bellboy", "Bellboy Types", "Manage Vehicles", "Manage Vehicles Type", "Manage Brand", "Manage Model", "Complaints", "Finance Reports", "Monitoring Reports", "User Management", "Roles Management", "Advertisement", "Notification", "Hiring Charges", "Hiring Action Types"]
        // enum: ['DASHBOARD', 'CUSTOMER', 'BELLBOY','DEPARTMENT', 'REPORT', 'CATEGORY', 'VEHICLE', 'ORDER', 'SETTING']
    },
}, {
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
})

module.exports = mongoose.model('role', schema);