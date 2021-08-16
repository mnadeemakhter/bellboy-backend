const VehicleBrandService = require('./../../services/vehicle-brands')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class VehicleBrandController {

    async addVehicleBrand(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('VehicleBrand Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)




            let vehicleBrand = await VehicleBrandService.getVehicleBrand({ title: data.title });

            if (vehicleBrand) throw new apiErrors.ResourceAlreadyExistError('VehicleBrand', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;

            console.log(req.file)
            if (!data.vehicleTypes) throw new apiErrors.ValidationError('VehicleTypes', messages.VEHICLE_TYPE_ID_VALIDATION);
            let vehicleTypes = data.vehicleTypes.split(",").map(function (val) { return val });
            data.vehicleTypes = vehicleTypes;
            let newData = await VehicleBrandService.addVehicleBrand(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title ,type:'vb'});
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await VehicleBrandService.getVehicleBrand({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success({ VehicleBrand: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getVehicleBrands(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await VehicleBrandService.VehicleBrandTotalCount({ title: new RegExp(search, 'i') })

            let VehicleBrands = await VehicleBrandService.getVehicleBrands({ title: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ VehicleBrands, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getVehicleBrand(req, res) {
        try {

          
            let data = Object.assign({},req.params);
            let vehicleBrand = await VehicleBrandService.getVehicleBrand({_id:data.vehicleBrand});



            return res.status(200).send(ResponseService.success(vehicleBrand))

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
            if (!data.vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', messages.VehicleBrand_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label,type:'vb' });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await VehicleBrandService.updateVehicleBrand({ _id: data.vehicleBrand }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }

    async addVehicleTypes(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.vehicleTypes) throw new apiErrors.ValidationError('vehicleTypes', messages.VEHICLE_TYPE_ID_VALIDATION);
            let vehicleTypes = data.vehicleTypes.split(",").map(function (val) { return val });
            console.log(messages.arrowHead, vehicleTypes)
            if (!data.vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', messages.VEHICLE_BRAND_ID_VALIDATION);

            let vehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand });
            if (!vehicleBrand) throw new apiErrors.ValidationError('vehicleBrand', 'VehicleBrand ID is invalid');

            let checkVehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand, vehicleTypes: { $in: vehicleTypes } })
            if (checkVehicleBrand) throw new apiErrors.ResourceAlreadyExistError('vehicleTypes', messages.RESOURCE_ALREADY_EXISTS)


            let updateVehicleBrand = await VehicleBrandService.updateVehicleBrand({ _id: data.vehicleBrand }, { $push: { vehicleTypes: vehicleTypes } });
            res.send(ResponseService.success(updateVehicleBrand))

        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    async removeVehicleTypes(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.vehicleTypes) throw new apiErrors.ValidationError('VehicleTypes', messages.VEHICLE_TYPE_ID_VALIDATION);
            let vehicleTypes = data.vehicleTypes.split(",").map(function (val) { return val });
            console.log(messages.arrowHead, vehicleTypes)
            if (!data.vehicleBrand) throw new apiErrors.ValidationError('VehicleBrand', messages.VEHICLE_BRAND_ID_VALIDATION);

            let vehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand });
            if (!vehicleBrand) throw new apiErrors.ValidationError('VehicleBrand', 'VehicleBrand ID is invalid');

            let checkVehicleBrand = await VehicleBrandService.getVehicleBrand({ _id: data.vehicleBrand, vehicleTypes: { $in: vehicleTypes } })
            if (!checkVehicleBrand) throw new apiErrors.ResourceAlreadyExistError('VehicleTypes', messages.RESOURCE_ALREADY_EXISTS)


            let updateVehicleBrand = await VehicleBrandService.updateVehicleBrand({ _id: data.vehicleBrand }, { $pull: { vehicleTypes: { $in: vehicleTypes } } });
            res.send(ResponseService.success(updateVehicleBrand))

        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
}

module.exports = new VehicleBrandController();