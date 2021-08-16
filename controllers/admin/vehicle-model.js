const VehicleModelService = require('./../../services/vehicle-model')
const VehicleTypeService = require('./../../services/vehicle-type')
const VehicleBrandService = require('./../../services/vehicle-brands')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class VehicleModelController {

    async addVehicleModel(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('VehicleModel Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)




            let vehicleModel = await VehicleModelService.getVehicleModel({ title: data.title });

            if (vehicleModel) throw new apiErrors.ResourceAlreadyExistError('vehicleModel', messages.RESOURCE_ALREADY_EXISTS)



            if (!data.vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.VEHICLE_TYPE_ID_VALIDATION);
            let vehicleType = await VehicleTypeService.getVehicleType({ _id: data.vehicleType });
            if (!vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.INVALID_ID_VALIDATION);

            if (!data.vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', messages.VEHICLE_BRAND_ID_VALIDATION);
            let vehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand });
            if (!vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', messages.INVALID_ID_VALIDATION);

            let newData = await VehicleModelService.addVehicleModel(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'vm' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await VehicleModelService.getVehicleModel({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success({ VehicleModel: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getVehicleModels(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await VehicleModelService.VehicleModelTotalCount({ title: new RegExp(search, 'i') })

            let vehicleModels = await VehicleModelService.getVehicleModels({ title: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ vehicleModels, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getVehicleModel(req, res) {
        try {

            let data = Object.assign({}, req.params);

            let vehicleModel = await VehicleModelService.getVehicleModel({ _id: data.vehicleModel })

            return res.status(200).send(ResponseService.success(vehicleModel))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async assignLabel(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log(messages.arrowHead, data)
            if (!data.label) throw new apiErrors.ValidationError('label', messages.LABEL_VALIDATION);
            if (!data.locale) throw new apiErrors.ValidationError('locale', messages.LOCALE_VALIDATION);
            if (!data.vehicleModel) throw new apiErrors.ValidationError('vehicleModel', messages.VEHICLE_MODEL_ID_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await VehicleModelService.getVehicleModel({ _id: data.vehicleModel, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: 'vm' });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await VehicleModelService.updateVehicleModel({ _id: data.vehicleModel }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }

}

module.exports = new VehicleModelController();