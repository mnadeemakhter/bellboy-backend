const VehicleModel = require('./../models/vehicle-model')

class VehicleModelService {
    addVehicleModel(request) {
        return new VehicleModel(request).save();
    }

    getVehicleModels(request) {
        return VehicleModel.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleType', select: '-labels -locales' }, { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' }]);
    }

    getOnlyVehicleModels(request) {
        return VehicleModel.find(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } },]).select('-vehicleType -vehicleBrand');
    }

    getVehicleModel(request) {
        return VehicleModel.findOne(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }, { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' }]);
    }

    VehicleModelTotalCount(request) {
        return VehicleModel.countDocuments(request)
    }

    updateVehicleModel(request, criteria) {
        return VehicleModel.findOneAndUpdate(request, criteria, { new: true }).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }, { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' }]);
    }

    deleteVehicleModel(request) {
        return VehicleModel.findOneAndDelete(request).populate([{ path: 'locales' }, { path: 'labels', populate: { path: 'locale' } }, { path: 'vehicleTypes', select: '-labels -locales' }, { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' }]);
    }
}

module.exports = new VehicleModelService();