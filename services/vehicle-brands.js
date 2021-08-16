const VehicleBrand = require('../models/vehicle-brand')

class VehicleBrandService {
    addVehicleBrand(request) {
        return new VehicleBrand(request).save();
    }

    getVehicleBrands(request) {
        return VehicleBrand.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }]);
    }
    getOnlyVehicleBrands(request) {
        return VehicleBrand.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]).select('-vehicleTypes');
    }

    getVehicleBrand(request) {
        return VehicleBrand.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }]);
    }

    VehicleBrandTotalCount(request) {
        return VehicleBrand.countDocuments(request)
    }

    updateVehicleBrand(request, criteria) {
        return VehicleBrand.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }]);
    }

    deleteVehicleBrand(request) {
        return VehicleBrand.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }]);
    }
}

module.exports = new VehicleBrandService();