const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

class LocaleController {

    async addLocale(req, res) {
        try {
            let data = Object.assign({}, req.body);
            console.log('Locale Data', messages.arrowHead, data)

            if (!data.title) throw new apiErrors.ValidationError('title', messages.TITLE_VALIDATION)
            if (!data.code) throw new apiErrors.ValidationError('code', messages.LOCALE_CODE_VALIDATION)


            let checkData;
            checkData = await LocaleService.getLocale({ title: data.title });
            if (checkData) throw new apiErrors.ResourceAlreadyExistError('title', messages.RESOURCE_ALREADY_EXISTS)

            checkData = await LocaleService.getLocale({ code: data.code });
            if (checkData) throw new apiErrors.ResourceAlreadyExistError('code', messages.RESOURCE_ALREADY_EXISTS)

            let newData = await LocaleService.addLocale(data);
            //await LocaleService.addLocale(cat)
            return res.status(200).send(ResponseService.success({ locale: newData }))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getLocales(req, res) {
        try {

            let pageNo = parseInt(req.query.pageNo)
            let perPage = parseInt(req.query.perPage)
            let search = req.query.search || ''

            let total = await LocaleService.LocaleTotalCount({ title: new RegExp(search, 'i') })

            let data = await LocaleService.getLocales({ title: new RegExp(search, 'i') }, perPage, pageNo)

            return res.status(200).send(ResponseService.success({ data, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
}

module.exports = new LocaleController();