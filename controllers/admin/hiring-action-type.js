const HiringActionTypeService = require('./../../services/hiring-action-type')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const { hiringActionState } = require('../../common/messages')

class HiringActionTypeController {

    async addHiringActionType(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('HiringActionType Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.description) throw new apiErrors.ValidationError('decription', messages.DESCRIPTION_VALIDATION)


            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)




            let HiringActionType = await HiringActionTypeService.getHiringActionType({ title: data.title });

            if (HiringActionType) throw new apiErrors.ResourceAlreadyExistError('hiringActionType', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;


            let newData = await HiringActionTypeService.addHiringActionType(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'ht' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);


            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await HiringActionTypeService.getHiringActionType({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success(fetchData))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async updateHiringActionType(req, res) {
        try {
            let data = Object.assign({}, req.body);


            if (!data.action_type_id) throw new apiErrors.ValidationError('action_type_id', 'Action Type Id Required');

            let actionType = await HiringActionTypeService.getHiringActionType({ _id: data.action_type_id });

            if (!actionType) throw new apiErrors.ResourceNotFoundError('actionType', messages.RESOURCE_NOT_FOUND)


            if (data.title) {
                if (!data.label_id) throw new apiErrors.ValidationError('label_id', messages.LABEL_VALIDATION)


                let checkLabel = await LabelService.getLabel({ _id: data.label_id });

                if (!checkLabel) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND)

                let duplicate = await LabelService.getLabel({ label: data.title, _id: { $ne: data.label_id } });

                if (duplicate) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)



                let locale = await LocaleService.getLocale({ code: 'en' });
                if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);


                if (locale._id.toString() === checkLabel.locale.toString()) {
                    actionType.title = data.title;
                }

                checkLabel.label = data.title;
                await checkLabel.save();
            }

            if (data.status) actionType.status = data.status;

            if (data.description) actionType.description = data.description;
            if (req.file) 
            actionType.icon = req.file.key;
            // actionType.icon = req.file.destination + '/' + req.file.filename;

            actionType = await actionType.save();
            if (!actionType) throw new apiErrors.UnexpectedError();



            actionType = await HiringActionTypeService.getHiringActionType({ _id: actionType._id });


            return res.status(200).send(ResponseService.success(actionType))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getHiringActionTypes(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''
            let sortBy = req.query.sortBy || "-created_at";

            let filters = { title: new RegExp(search, 'i') }

            if (req.query.status) filters.status = Boolean(req.query.status);



            let total = await HiringActionTypeService.HiringActionTypeTotalCount()

            let HiringActionTypes = await HiringActionTypeService.getHiringActionTypes(filters, perPage, pageNo,sortBy)
            console.log("HiringActionTypes", messages.arrowHead, HiringActionTypes)
            return res.status(200).send(ResponseService.success({ HiringActionTypes, count: total }))

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
            if (!data.hiringActionType) throw new apiErrors.ValidationError('hiringActionType', messages.HIRING_ACTION_TYPE_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await HiringActionTypeService.getHiringActionType({ _id: data.hiringActionType, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: 'ht' });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await HiringActionTypeService.updateHiringActionType({ _id: data.hiringActionType }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }


}

module.exports = new HiringActionTypeController();