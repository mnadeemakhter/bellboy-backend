const VehicleTypeService = require('./../../services/vehicle-type')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class VehicleTypeController {

    async addVehicleType(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('VehicleType Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)


            //  if (!data.hasPlate) throw new apiErrors.ValidationError('hasPlate', messages.HAS_PLATE_VALIDATION);

            let VehicleType = await VehicleTypeService.getVehicleType({ title: data.title });

            if (VehicleType) throw new apiErrors.ResourceAlreadyExistError('vehicleType', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;

            console.log(req.file);
            let newData = await VehicleTypeService.addVehicleType(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'vt' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await VehicleTypeService.getVehicleType({ _id: updatedData._id });

            return res.status(200).send(ResponseService.success({ VehicleType: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getVehicleTypes(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await VehicleTypeService.VehicleTypeTotalCount({ title: new RegExp(search, 'i') })

            let VehicleTypes = await VehicleTypeService.getVehicleTypes({ title: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ VehicleTypes, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getVehicleType(req, res) {
        try {


            let data = Object.assign({}, req.params);
            let vehicleType = await VehicleTypeService.getVehicleType({ _id: data.vehicleType })

            return res.status(200).send(ResponseService.success(vehicleType))

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
            if (!data.vehicleType) throw new apiErrors.ValidationError('vehicleType', messages.VehicleType_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await VehicleTypeService.getVehicleType({ _id: data.vehicleType, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: 'vt' });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await VehicleTypeService.updateVehicleType({ _id: data.vehicleType }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
}

module.exports = new VehicleTypeController();