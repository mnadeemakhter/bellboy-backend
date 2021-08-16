const CategoryService = require('./../../services/category')
const LabelService = require('./../../services/labels')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')
const LocalizationService = require('../../common/localization')
class CategoryController {

    async addCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Category Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            let checkLabel = await LabelService.getLabel({ label: data.title });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)

            let category = await CategoryService.getCategory({ title: data.title });

            if (category) throw new apiErrors.ResourceAlreadyExistError('category', messages.RESOURCE_ALREADY_EXISTS)

            if (!req.file) throw new apiErrors.ResourceNotFoundError('icon', messages.IMAGE_VALIDATION)

            // data.icon = req.file.destination + '/' + req.file.filename;
            data.icon = req.file.key;

            console.log(req.file)

            let newData = await CategoryService.addCategory(data);
            if (!newData) throw new apiErrors.UnexpectedError();

            let locale = await LocaleService.getLocale({ code: 'en' });
            if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);
            let label = await LabelService.addLabel({ locale: locale._id, label: data.title, type: 'c' });
            if (!label) throw new apiErrors.UnexpectedError();
            newData.locales.push(locale._id);
            newData.labels.push(label._id);

            let updatedData = await newData.save();

            if (!updatedData) throw new apiErrors.UnexpectedError();

            // if (!localeE) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let fetchData = await CategoryService.getCategory({ _id: updatedData._id });

            return res.status(200).send(ResponseService.success({ category: fetchData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async getCategories(req, res) {
        try {



            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = (req.query.search || '').toLowerCase();

            let total = await CategoryService.CategoryTotalCount({ title: new RegExp(search, 'i'), }, perPage, pageNo)
            // let code = req.query.locale || 'en';
            // let locale = await LocaleService.getLocale({ code: code });
            // console.log(locale);
            // if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let categories = await CategoryService.getCategories({ title: new RegExp(search, 'i'), }, perPage, pageNo)
            //      categories = LocalizationService.getLabels(categories, code);
            return res.status(200).send(ResponseService.success({ categories, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getAllCategories(req, res) {
        try {



            let categories = []
            categories = await CategoryService.getAllCategories({ status:true })
         
            return res.status(200).send(ResponseService.success({ categories, count: categories.length }))

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
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);

            data.type = 'c';
            let locale = await LocaleService.getLocale({ _id: data.locale });
            if (!locale) throw new apiErrors.ResourceNotFoundError('locale', 'Invalid Locale');
            let checkLabel = await LabelService.getLabel({ label: data.label });
            if (checkLabel) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)
            let checkLocale = await CategoryService.getCategory({ _id: data.category, locales: { '$in': [data.locale] } });
            if (checkLocale) throw new apiErrors.ResourceAlreadyExistError('locale', messages.LOCALE_ALREADY_EXISTS_IN)

            let label = await LabelService.addLabel({ locale: data.locale, label: data.label, type: data.type });
            if (!label) throw new apiErrors.UnexpectedError();
            let updatedData = await CategoryService.updateCategory({ _id: data.category }, { $push: { locales: data.locale, labels: label._id } });

            if (!updatedData) throw new apiErrors.UnexpectedError();
            res.send(ResponseService.success(updatedData))
        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    async toggleCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.NotFoundError();

            let updateCategory = await CategoryService.updateCategory({ _id: data.category }, { status: !category.status });
            return res.status(200).send(ResponseService.success({ category: updateCategory }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async updateCategory(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_VALIDATION);
            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ResourceNotFoundError('category');
            if (req.file) {
                // data.icon = req.file.destination + '/' + req.file.filename;
                data.icon = req.file.key;
                category.icon = data.icon;
            }
            if (data.title) {
                if (!data.label_id) throw new apiErrors.ValidationError('label_id', messages.LABEL_VALIDATION)


                let checkLabel = await LabelService.getLabel({ _id: data.label_id });

                if (!checkLabel) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND)

                let duplicate = await LabelService.getLabel({ label: data.title, _id: { $ne: data.label_id } });

                if (duplicate) throw new apiErrors.ResourceAlreadyExistError('label', messages.RESOURCE_ALREADY_EXISTS)



                let locale = await LocaleService.getLocale({ code: 'en' });
                if (!locale) throw new apiErrors.ResourceNotFoundError('label', messages.RESOURCE_NOT_FOUND);


                if (locale._id.toString() === checkLabel.locale.toString()) {
                    category.title = data.title;
                }

                checkLabel.label = data.title;
                await checkLabel.save();
            }
            if(data.status) category.status = data.status;

           
            category = await category.save();
            if (!category) throw new apiErrors.UnexpectedError();



            category = await CategoryService.getCategory({ _id: data.category });

            return res.status(200).send(ResponseService.success({ category: category }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async addDepartments(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.departments) throw new apiErrors.ValidationError('department', messages.DEPARTMENT_ID_VALIDATION);
            let departments = data.departments.split(",").map(function (val) { return val });
            console.log(messages.arrowHead, departments)
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_ID_VALIDATION);

            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ValidationError('category', 'Category ID Invalid');

            let checkData = await CategoryService.getCategory({ _id: data.category, departments: { $in: departments } })
            if (checkData) throw new apiErrors.ResourceAlreadyExistError('departments', messages.RESOURCE_ALREADY_EXISTS)


            let updateData = await CategoryService.updateCategory({ _id: data.category }, { $push: { departments: departments } });
            res.send(ResponseService.success(updateData))

        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    async removeDepartments(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.departments) throw new apiErrors.ValidationError('departments', messages.DEPARTMENT_ID_VALIDATION);
            let departments = data.departments.split(",").map(function (val) { return val });
            console.log(messages.arrowHead, departments);
            if (!data.category) throw new apiErrors.ValidationError('category', messages.CATEGORY_ID_VALIDATION);

            let category = await CategoryService.getCategory({ _id: data.category });
            if (!category) throw new apiErrors.ValidationError('category', 'Category ID is invalid');

            let checkData = await CategoryService.getCategory({ _id: data.category, departments: { $in: departments } })
            if (!checkData) throw new apiErrors.ResourceAlreadyExistError('departments', messages.RESOURCE_ALREADY_EXISTS)


            let updateData = await CategoryService.updateCategory({ _id: data.category }, { $pull: { departments: { $in: departments } } });
            res.send(ResponseService.success(updateData))

        } catch (error) {
            res.send(ResponseService.failure(error))
        }
    }
    async getCategory(req, res) {
        try {

            let data = Object.assign({}, req.params);
            // let code = req.params.locale || 'en';
            // let locale = await LocaleService.getLocale({ code: code });
            // console.log(locale);
            // if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let category = await CategoryService.getCategory({ _id: data.id })

            if (!category) throw new apiErrors.ResourceNotFoundError('category', 'Invalid category id')
            // category = LocalizationService.getLabels([category], code);
            // category = category[0];
            return res.status(200).send(ResponseService.success(category))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new CategoryController();