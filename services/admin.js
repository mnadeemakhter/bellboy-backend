const Admin = require('../models/admin')
const messages = require('../common/messages')
class AdminService {
    getAdmin(request) {
        return Admin.findOne(request).populate({ path: 'role' });
    }
    updateAdminLastSeen(request) {
        return Admin.updateOne(request,{last_seen:Date.now()});
    }
    getAdminSimply(request) {
        return Admin.findOne(request);
    }
    getAdmins(request) {
        return Admin.find(request).populate({ path: 'role' })
    }
    adminTotalCount(request) {
        return Admin.countDocuments(request)
    }
    createAdmin(request) {
        return new Admin(request).save();
    }
    updateAdmin(details, criteria) {
        return Admin.findOneAndUpdate(criteria, details, { new: true }).populate({ path: 'role' })
    }
    deleteAdmin(criteria) {
        return Admin.findOneAndDelete(criteria).populate({ path: 'role' })
    }
}

module.exports = new AdminService();