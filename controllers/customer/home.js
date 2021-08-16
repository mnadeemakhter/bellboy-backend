const BellBoyTypeService = require('./../../services/bellboy-type')
const ChargesService = require('./../../services/charges')
const LocaleService = require('./../../services/locales')
const ResponseService = require('./../../common/response')
const LocalizationService = require('./../../common/localization');
const CategoryService = require('./../../services/category')
const OrderService = require('./../../services/order')
const CustomerService = require('./../../services/customer')
const HiringService = require('./../../services/hirings')
const AdvertisementService = require('./../../services/advertisement')
const HiringCartService = require('../../services/hiring-cart')
const HiringActionTypeService = require('./../../services/hiring-action-type')
//Error Handling
const messages = require('../../common/messages')
const apiErrors = require('../../common/api-errors');
const hiring = require('../../models/hiring');


class HomeController {
    async getHome(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) throw new apiErrors.ResourceNotFoundError('locale');


            let bellboyTypes = [];
            let activeDeliveries = 0;
            let activeHirings = 0;
            let activeCategories = [];

            activeCategories = await CategoryService.getActiveCategories();

            activeCategories = LocalizationService.getLabels(activeCategories, code);



            activeDeliveries = await OrderService.OrderTotalCount({ customer: user_id, status: { $gte: 1, $lte: 5 } });
            activeHirings = await HiringService.HiringTotalCount({ customer: user_id, status: { $gte: 1, $lte: 3 } });


            let charges = await ChargesService.aggregateChargesByBellBoyType(2);



            charges = LocalizationService.getLabelsWithNestedKey(charges, code, 'bellboy_type');

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
                    case '5ee08bdf69e94f28a37dadca':
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


            return res.status(200).send(ResponseService.success({ activeCategories, activeDeliveries, activeHirings, bellboyTypes }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getHomeForHiring(req, res) {
        try {
            const user_id = req._user_info._user_id;
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

            let advertisements = [];
            advertisements = await AdvertisementService.getAdvertisements({ status: true });


            let hiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            if (!hiringCart) hiringCart = undefined;

            var hasCart = false;
            var totalTasks = 0.0;
            if (hiringCart != undefined) {
                if (hiringCart.actions.length > 0) {
                    hasCart = true;
                    totalTasks = hiringCart.actions.length;
                    hiringCart.actions = LocalizationService.getLabelForHiringCart(hiringCart.actions, 'en');
                }
            }
            hiringCart = {};
            //     else{

            //   }


            let activeHirings = await HiringService.getHiringsSimply({
                status: { $gte: 1, $lte: 3 },
                customer: user_id
            })

            let hasActiveHiring = activeHirings.length > 0 ? true : false;
            let totalActiveHirings = activeHirings.length;
            let hiringActionTypes = await HiringActionTypeService.getHiringActionTypesForCustomer({ status: true })

            hiringActionTypes = await LocalizationService.getLabels(hiringActionTypes, code);

            return res.status(200).send(ResponseService.success({
                bellboyTypes,
                advertisements,
                hiringCart,
                hiringActionTypes,
                hasCart,
                totalTasks,
                hasActiveHiring,
                totalActiveHirings,
            }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async setCustomerStats(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let customer = await CustomerService.getCustomer({ _id: user_id });

            customer.last_active = Date.now();

            customer = await customer.save();

            return res.status(200).send(ResponseService.success({ customer }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async setCustomerLocation(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let location = {
                address: data.address,
                near_by: data.near_by,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            }

            let customer = await CustomerService.getCustomer({ _id: user_id });
            customer.location = location;
            customer.last_active = Date.now();

            customer = await customer.save();


            return res.status(200).send(ResponseService.success({ customer }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async getHomeInfo(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);
            
            
            const hasfreeorder=await HiringService.getHiring({customer:user_id,status:4})
            console.log("hasfreeorder=>",hasfreeorder)
            let hiringCart = await HiringCartService.getHiringCart({ customer: user_id });
            if (!hiringCart) hiringCart = undefined;

            var hasCart = false;
            var totalTasks = 0.0;
            if (hiringCart != undefined) {
                if (hiringCart.actions.length > 0) {
                    hasCart = true;
                    totalTasks = hiringCart.actions.length;
                    hiringCart.actions = LocalizationService.getLabelForHiringCart(hiringCart.actions, 'en');
                }
            }
            hiringCart = {};
            let activeHirings = await HiringService.getHiringsSimply({
                status: { $gte: 1, $lte: 3 },
                customer: user_id
            })

            let hasActiveHiring = activeHirings.length > 0 ? true : false;
            let totalActiveHirings = activeHirings.length;


            return res.status(200).send(ResponseService.success({
                //add hasfreeorder field,
                hasfreeorder:hasfreeorder?false:true,
                hasCart,
                totalTasks,
                hasActiveHiring,
                totalActiveHirings,
            }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }


    getChargesCalculation(charges) {
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

        return bellboyTypes;
    }
}



module.exports = new HomeController();