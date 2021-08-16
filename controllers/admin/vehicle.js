
const VehicleService = require('../../services/vehicle')
const ResponseService = require('../../common/response')
const apiError = require('../../common/api-errors')
const messages = require('../../common/messages')
const helper = require('../../common/helper')
const apiErrors = require('../../common/api-errors')

class AdminVehicleController {

    async getVehicles(req, res) {
        try {

            let data = Object.assign({}, req.query);
            let search = data.search || ''
            let filters = {
                'plate.plate_number': new RegExp(search, 'i'),
                
            };
            if (data.approval) {
                filters['approval'] =data.approval;
                if (!(data.approval >= 0 && data.approval < 2)) throw new apiError.ValidationError('approval', messages.APPROVAL_ENUM_VALIDATION)
            }
            let fetchedData = [];
            fetchedData = await VehicleService.getVehicles(filters);
            let countData = fetchedData.length;

            let response = { count: countData, vehicles: fetchedData };

            res.send(ResponseService.success(response));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async getVehicle(req, res) {
        try {

            let data = Object.assign({}, req.params);


            let vehicle = await VehicleService.getVehicleForAdmin({ _id: data.vehicle });
            if (!vehicle) throw new apiErrors.ResourceNotFoundError('vehicle');

          

            res.send(ResponseService.success(vehicle));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async approveVehicle(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log(messages.arrowHead, data);
            if (!data.approval) throw new apiError.ValidationError('approval', messages.APPROVAL_VALIDATION)
            if (!(data.approval >= 0 && data.approval < 2)) throw new apiError.ValidationError('approval', messages.APPROVAL_ENUM_VALIDATION)
            if (!data.vehicle) throw new apiError.ValidationError('vehicle', messages.VEHICLE_ID_VALIDATION)
            if (!helper.isValidMongoID(data.vehicle)) throw new apiError.ValidationError('vehicle', messages.INVALID_ID_VALIDATION)
            let vehicle = await VehicleService.updateVehicle({ _id: data.vehicle }, { 'approval': data.approval });
            if (!vehicle) throw new apiError.UnexpectedError();
            return res.status(200).send(ResponseService.success(vehicle))
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async toggleVehicleStatus(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log(messages.arrowHead, data);

            if (!data.vehicle) throw new apiError.ValidationError('vehicle', messages.VEHICLE_ID_VALIDATION)
            if (!helper.isValidMongoID(data.vehicle)) throw new apiError.ValidationError('vehicle', messages.INVALID_ID_VALIDATION)
            let fetchedData = await VehicleService.getVehicle({ _id: data.vehicle });
            if (!fetchedData) throw new apiError.ResourceNotFoundError();
            let status = !fetchedData.status;

            let vehicle = await VehicleService.updateVehicle({ _id: data.vehicle }, { 'status': status });
            if (!vehicle) throw new apiError.UnexpectedError();
            return res.status(200).send(ResponseService.success(vehicle))
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new AdminVehicleController();