const DepartmentService = require('../../services/department')
const LabelService = require('../../services/labels')
const LocaleService = require('../../services/locales')
const ResponseService = require('../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class DepartmentController {

    async addDepartment(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Department Data', messages.arrowHead, data)


            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)

            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)

            let department = await DepartmentService.getDepartment({ title: data.title });

            if (department) throw new apiErrors.ResourceAlreadyExistError('Department', messages.RESOURCE_ALREADY_EXISTS)

            let newData = await DepartmentService.addDepartment(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);

            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();
            let fetchData = await DepartmentService.getDepartment({ _id: updatedData._id });
            return res.status(200).send(ResponseService.success({ department: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getDepartments(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await DepartmentService.DepartmentTotalCount({ title: new RegExp(search, 'i') })

            let Departments = await DepartmentService.getDepartments({ title: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ Departments, count: total }))

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
            if (!data.department) throw new apiErrors.ValidationError('department', messages.DEPARTMENT_ID_VALIDATION);

            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await DepartmentService.getDepartment({ _id: data.department, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await DepartmentService.updateDepartment({ _id: data.department }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
}

module.exports = new DepartmentController();