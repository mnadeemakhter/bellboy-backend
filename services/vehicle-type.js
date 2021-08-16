const VehicleType = require('../models/vehicle-type')

class VehicleTypeService {
    addVehicleType(request) {
        return new VehicleType(request).save();
    }

    getVehicleTypes(request) {
        return VehicleType.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    getVehicleType(request) {
        return VehicleType.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    VehicleTypeTotalCount(request) {
        return VehicleType.countDocuments(request)
    }

    updateVehicleType(request, criteria) {
        return VehicleType.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }

    deleteVehicleType(request) {
        return VehicleType.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }]);
    }
}

module.exports = new VehicleTypeService();