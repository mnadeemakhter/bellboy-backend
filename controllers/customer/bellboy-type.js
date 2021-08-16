const BellBoyTypeService = require('./../../services/bellboy-type')
const ChargesService = require('./../../services/charges')
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

            let type = req.query.type || 2;

            let charges = await ChargesService.aggregateChargesByBellBoyType(parseInt(type));



            charges = LocalizationService.getLabelsWithNestedKey(charges, code, 'bellboy_type');

            let bellboyTypes = [];
            charges.forEach(element => {
                let item = {};
                switch (element.bellboy_type._id.toString()) {
                    // case '5ee08bd469e94f28a37dadc8':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;
                    // case '5ee08bee69e94f28a37dadcc':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;
                    case '5f5da852abd69550176fad72':
                        item.bellboy_type = element.bellboy_type;
                        item.charges = ChargesService.getChargesCollection(element.charges);
                        bellboyTypes.push(item);
                        break;
                    // case '5ee08bcb69e94f28a37dadc6':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;

                }
            });

            return res.status(200).send(ResponseService.success(bellboyTypes))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getHiringBellBoyTypes(req, res) {
        try {

            let code = req.query.locale || 'en';
            let locale = await LocaleService.getLocale({ code: code });

            if (!locale) return res.status(200).send(ResponseService.success({}, 'Invalid Locale Code', false));

            

            let charges = await ChargesService.aggregateChargesByBellBoyType(2);



            charges = LocalizationService.getLabelsWithNestedKey(charges, code, 'bellboy_type');

            let bellboyTypes = [];
            charges.forEach(element => {
                let item = {};
                switch (element.bellboy_type._id.toString()) {
                    // case '5ee08bd469e94f28a37dadc8':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getHiringChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;
                    // case '5ee08bee69e94f28a37dadcc':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getHiringChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;
                    case '5f5da852abd69550176fad72':
                        item.bellboy_type = element.bellboy_type;
                        item.charges = ChargesService.getHiringChargesCollection(element.charges);
                        bellboyTypes.push(item);
                        break;
                    // case '5ee08bcb69e94f28a37dadc6':
                    //     item.bellboy_type = element.bellboy_type;
                    //     item.charges = ChargesService.getHiringChargesCollection(element.charges);
                    //     bellboyTypes.push(item);
                    //     break;

                }
            });

            return res.status(200).send(ResponseService.success(bellboyTypes))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }





}

module.exports = new BellBoyTypeController();