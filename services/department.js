const Department = require('../models/department')

class DepartmentService {
    addDepartment(request) {
        return new Department(request).save();
    }

    getDepartments(request) {
        return Department.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    getDepartment(request) {
        return Department.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    DepartmentTotalCount(request) {
        return Department.countDocuments(request)
    }

    updateDepartment(request, criteria) {
        return Department.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    deleteDepartment(request) {
        return Department.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]);
    }
}

module.exports = new DepartmentService();