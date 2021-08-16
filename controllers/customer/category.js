const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const messages = require('../../common/messages')
const CategoryService = require('./../../services/category')

const LocaleService = require('../../services/locales')
const LocalizationService = require('../../common/localization')
class CustomerCategoryController {

    async getActiveCategories(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = (req.query.search || '').toLowerCase();

            let total = await CategoryService.CategoryTotalCount({ title: new RegExp(search, 'i'), status: true })
            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });
            console.log(locale);
            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let categories = await CategoryService.getActiveCategories({ title: new RegExp(search, 'i'), status: true }, perPage, pageNo)
            categories = LocalizationService.getLabels(categories, code);
            return res.status(200).send(ResponseService.success({ categories, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new CustomerCategoryController();