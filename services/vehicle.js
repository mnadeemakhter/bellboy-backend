const Vehicle = require('../models/vehicle')

class VehicleService {
    addVehicle(request) {
        return new Vehicle(request).save();
    }

    getVehicles(request) {
        return Vehicle.find(request).populate([
            { path: 'vehicleType', select: '-labels -locales' },
            { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' },
            { path: 'vehicleModel', select: '-labels -locales -vehicleBrand -vehicleType' },
            { path: 'bellboy' }
        ]);
    }

    getVehicle(request) {
        return Vehicle.findOne(request);
    }

    getVehicleForAdmin(request) {
        return Vehicle.findOne(request).populate([
            { path: 'vehicleType', select: '-labels -locales' },
            { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' },
            { path: 'vehicleModel', select: '-labels -locales -vehicleBrand -vehicleType' },
            { path: 'bellboy',select:'name mobile avatar email working_status is_busy status _id ' }
        ]);
    }

    getVehicleForBellBoy(request) {
        return Vehicle.findOne(request).populate([
            { path: 'vehicleType', select: '-labels -locales' },
            { path: 'vehicleBrand', select: '-labels -locales -vehicleTypes' },
            { path: 'vehicleModel', select: '-labels -locales -vehicleBrand -vehicleType' },
        
        ]).select('-bellboy');
    }

    VehicleTotalCount(request) {
        return Vehicle.countDocuments(request);
    }

    updateVehicle(request, criteria) {
        return Vehicle.findOneAndUpdate(request, criteria, { new: true });
    }

    deleteVehicle(request) {
        return Vehicle.findOneAndDelete(request);
    }
}

module.exports = new VehicleService();