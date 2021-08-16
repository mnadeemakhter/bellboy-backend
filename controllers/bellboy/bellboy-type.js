const BellBoyTypeService = require('./../../services/bellboy-type')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')

//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors')

const LocalizationService = require('../../common/localization')

class BellBoyTypeController {


    async getBellBoyTypes(req, res) {
        try {

            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });

            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));


            let bellBoyTypes = await BellBoyTypeService.getBellBoyTypes({ status: true },{_id:'5f5da852abd69550176fad72'});

    //        bellBoyTypes = LocalizationService.getLabels(bellBoyTypes, code);

            return res.status(200).send(ResponseService.success(bellBoyTypes))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }



}

module.exports = new BellBoyTypeController();