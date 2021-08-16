const Role = require('./../models/roles')
const messages = require('../common/messages')

class RoleService {
    addRole(request) {
        return new Role(request).save();
    }

    getRoles(request) {
        return Role.find(request);
    }

    getRole(request) {
        return Role.findOne(request)
    }

    RoleTotalCount(request) {
        return Role.countDocuments(request)
    }

    updateRole(request, criteria) {
        return Role.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteRole(request) {
        return Role.findOneAndDelete(request);
    }
}

module.exports = new RoleService();