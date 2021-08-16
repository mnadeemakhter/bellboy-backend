const HiringActionTypeService = require('./../../services/hiring-action-type')
const ResponseService = require('./../../common/response')

const LocaleService = require('../../services/locales')
const LocalizationsService = require('../../common/localization')

class HiringActionTypeController {

   
    async getHiringActionTypes(req, res) {
        try {

            
          
            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });
            console.log(locale);
            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));
            let hiringActionTypes = await HiringActionTypeService.getHiringActionTypesForCustomer({status:true})

            hiringActionTypes = await LocalizationsService.getLabels(hiringActionTypes,code);

            return res.status(200).send(ResponseService.success(hiringActionTypes))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }


}

module.exports = new HiringActionTypeController();