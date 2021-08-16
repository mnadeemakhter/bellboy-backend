const BellBoyTypeService = require('./../../services/bellboy-type')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const bellboyType = require('../../models/bellboy-type')

class BellBoyTypeController {

    async addBellBoyType(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('BellBoyType Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title.toLowerCase() });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)




            let BellBoyType = await BellBoyTypeService.getBellBoyType({ title: data.title.toLowerCase() });

            if (BellBoyType) throw new apiErrors.ResourceAlreadyExistError('bellBoyType', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            data.title = data.title.toLowerCase();
            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;

            console.log(req.file)

            let newData = await BellBoyTypeService.addBellBoyType(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('locale', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title.toLowerCase(), type: 'bt' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();


            let fetchData = await BellBoyTypeService.getBellBoyType({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success({ bellBoyType: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getBellBoyTypes(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await BellBoyTypeService.BellBoyTypeTotalCount({ title: new RegExp(search.toLowerCase(), 'i') })

            let bellBoyTypes = await BellBoyTypeService.getBellBoyTypes({ title: new RegExp(search.toLowerCase(), 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ bellBoyTypes, count: total }))

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
            if (!data.BellBoyType) throw new apiErrors.ValidationError('id', messages.ID_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label.toLowerCase() });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await BellBoyTypeService.getBellBoyType({ _id: data.id, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label.toLowerCase(), type: 'bt' });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await BellBoyTypeService.updateBellBoyType({ _id: data.id }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }

    async updateBellBoyType(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.bellBoyType) throw new apiErrors.ValidationError('bellBoyType', messages.BELLBOY_TYPE_VALIDATION)









            let bellBoyType = await BellBoyTypeService.getBellBoyTypeSimply({ _id: data.bellBoyType });

            if (!bellBoyType) throw new apiErrors.ResourceNotFoundError('bellBoyType', messages.RESOURCE_NOT_FOUND)

            if (data.title) {


                let locale = await LocaleService.getLocale({ code: 'en' });
                if (!locale) throw new apiErrors.ResourceNotFoundError('locale', messages.RESOURCE_NOT_FOUND);


                let checkLabel = await LabelService.getLabel({ label: data.title });
                if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)


                let label = await LabelService.updateLabel({ label: bellBoyType.title }, {  label: data.title.toLowerCase(),});

                bellBoyType.title = data.title.toLowerCase();


                bellBoyType = await bellBoyType.save();
            }



            if (req.file) 
            bellBoyType.icon = req.file.key;
            // bellBoyType.icon = req.file.destination + '/' + req.file.filename;


            if (data.status) bellBoyType.status = data.status;

            bellBoyType = await bellBoyType.save();

            bellBoyType = await BellBoyTypeService.getBellBoyType({ _id: data.bellBoyType });

            return res.status(200).send(ResponseService.success({ bellBoyType: bellBoyType }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }


}

module.exports = new BellBoyTypeController();