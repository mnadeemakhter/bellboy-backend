const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const BellBoyService = require('../../services/bell-boy')
const AdminService = require('../../services/admin')
const HiringCartService = require('../../services/hiring-cart')
const HiringService = require('../../services/hirings')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const PushNotificationService = require('../../common/push-notification')
const messages = require('../../common/messages')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')
const dashboard= require("../admin/dashboard")

const cryptoRandomString = require('crypto-random-string')


class HiringController {
    async placeOrder(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);



            // if (!data.bellboyType) throw new apiErrors.ValidationError('bellboyType', messages.BELLBOY_TYPE_VALIDATION);

            let cart = await HiringCartService.getHiringCartSimply({ customer: user_id });

            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');

            let uniqueId;
            let hiring;
            while (1) {
                uniqueId = cryptoRandomString({ length: 6 });

                hiring = await HiringService.getHiringSimply({ hiring_id: uniqueId })
                if (!hiring) break;
                else continue;

            }

            let keys = Object.keys(cart.toObject());

            let d = {
                hiring_id: uniqueId,
                customer: user_id,

            };

            keys.forEach(element => {
                if (element !== 'created_at' && element !== 'updated_at' && element !== '_id') {
                    d[element] = cart[element];
                }

            });

            d.amount = data.amount;
            d.bellboyType = data.bellboyType;
            d.hours = data.hours;
            d.pricePerHour = data.pricePerHour;
            d.location = {
                address: data.address,
                near_by: data.near_by,
                geolocation: {
                    latitude: data.latitude,
                    longitude: data.longitude,
                }
            }
            let newData = await HiringService.createHiring(d);
            if (newData) {
                await HiringCartService.deleteHiringCart({ customer: user_id });
            }

            hiring = await HiringService.getHiring({ _id: newData._id });

            //  let bellboys = await BellBoyService.getBellboys({ working_status: true, bellboyType: data.bellboyType });
            let admins = await AdminService.getAdmins({ status: true });

            let tokens = [];


            if (admins.length > 0) {
                admins.forEach(element => {
                    if (element.fcm_token != '')
                        tokens.push(element.fcm_token);
                });
                var msg = await PushNotificationService.notifyMultipleDevices(
                    {
                        title: 'New Hiring Posted',
                        body: 'A hiring request is generated from ' + hiring.customer.name
                    },
                    tokens,
                    {
                        _id: hiring.hiring_id.toString(),
                        type: '2'
                    }
                );

            }
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))



            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }

            // for real time but not tested
            // const socketUser = req.app.io;
            // const DashboardDetails=await dashboard.getDashboardDetails({});
            // socketUser.emit(`dashboard`,DashboardDetails);



            return res.status(200).send(ResponseService.success(hiring))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async getOrders(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.query);
            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            // if (!data.type) throw new apiErrors.ValidationError('type', messages.TYPE_VALIDATION);

            let request = {};
            if (data.type == 1) {
                request = {
                    status: { $gte: 1, $lte: 3 },
                    customer: user_id
                };
            }
            else {
                request = {
                    status: { $gte: 4, $lte: 5 },
                    customer: user_id
                };
            }



            let total = await HiringService.HiringTotalCount(request)

            let hirings = await HiringService.getHiringsForCustomer(request, perPage, pageNo)




            if (hirings.length != 0) {
                for (const hiring of hirings) {

                    hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
                }
            }



            return res.status(200).send(ResponseService.success({ hirings: hirings, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async getHiringDetail(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.query);

            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.ID_VALIDATION);
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))



            let request = { customer: user_id, hiring_id: data.hiring_id };

            let hiring = await HiringService.getHiring(request)

            if (!hiring) res.status(200).send(ResponseService.success({}, 'Hiring Not Found', false))

            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }




            return res.status(200).send(ResponseService.success(hiring))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async manageActionCancellationStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let hiring = await HiringService.getHiring({ _id: data.hiring_id });

            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring Found', false));

            if (hiring.actions.id(data.action_id).progress > 1)
                return res.send(ResponseService.success({}, 'Action is in progress, you cannot cancel it', false))


            hiring.actions.id(data.action_id).status = true;
            hiring.actions.id(data.action_id).isCancelled = true;
            hiring.actions.id(data.action_id).cancelledBy = 1;
            hiring.actions.id(data.action_id).progress = 4;
            hiring.actions.id(data.action_id).cancellationReason = data.cancellationReason;
            //     hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            hiring = await hiring.save();
            let action = hiring.actions.id(data.action_id);
            await PushNotificationService.notifySingleDevice({
                title: 'Action ' + action.actionType.title + ' Cancelled!',
                body: 'Customer ' + hiring.customer.name + ' has cancelled the action',
            }, hiring.bellboy.fcm_token, { _id: hiring._id.toString(), type: '1' });
            return res.send(ResponseService.success(hiring));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async verifyCode(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let hiring = await HiringService.getHiringSimply({ customer: user_id, _id: data.hiring_id, });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring', false));



            hiring.is_completed = true;
            hiring.for_verification = false;
            hiring.status = 4;
            await hiring.save();
            await BellBoyService.updateBellboy({ busy_in: 0, is_busy: false }, { _id: hiring.bellboy });
            hiring = await HiringService.getHiring({ _id: data.hiring_id });
            await PushNotificationService.notifySingleDevice({
                title: 'Great Work',
                body: 'BellBoy ' + hiring.bellboy.name + ' you have done a great job',
            }, hiring.bellboy.fcm_token, { _id: hiring._id.toString(), type: '2' });
            return res.send(ResponseService.success({}, 'Thanks for Closing the Order', true));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getCancellationReason(req, res) {
        try {
            let data = Object.assign({}, req.query);
            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.ORDER_ID_VALIDATION)
            let hiring = await HiringService.getHiring({ hiring_id: data.hiring_id });

            if (!hiring) throw new apiErrors.NotFoundError('hiring', 'No Hiring Found against this ID');

            let status = hiring.status;

            let reasons = [];
            if (status > 0 && status < 4) {
                switch (status) {
                    case 1:
                        reasons = messages.stage1;
                        break;
                    case 2:
                        reasons = messages.stage2;
                        break;
                    case 3:
                        reasons = messages.stage3;
                        break;

                }
            }


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }

            return res.status(200).send(ResponseService.success({ reasons: reasons }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async canceOrder(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.ID_VALIDATION);
            if (!data.reason) throw new apiErrors.ValidationError('reason', messages.REASON_VALIDATION);

            let hiring = await HiringService.getHiring({ hiring_id: data.hiring_id });
            if (hiring.status > 3) return res.send(ResponseService.success({}, 'Hiring Cannot be cancelled at this stage', false))

            var actionActive = false;
            let actions = [];
            actions = hiring.actions;
            actions = await actions.filter(element => element.progress > 1);
            if (actions.length > 0) actionActive = true;

            if (actionActive) return res.send(ResponseService.success({}, 'Hiring Cannot be cancelled at this stage', false))

            var status = hiring.status;


            hiring.status = 5;
            hiring.cancellation_reason = data.reason;
            hiring.cancelled_by = 1;
            // Add cancellation_time if user cancell order. 
            hiring.cancellation_time= Date.now();
            // console.log("hiring==>>",hiring)
             await hiring.save();
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            if (hiring.actions.length > 0) {
                hiring.actions = LocalizationService.getLabelForHiringCart(hiring.actions, 'en');
            }
            if (status > 1) {
                await BellBoyService.updateBellboy({ busy_in: 0, is_busy: false }, { _id: hiring.bellboy._id });
                await PushNotificationService.notifySingleDevice({
                    title: 'Sorry Champ',
                    body: 'BellBoy ' + hiring.bellboy.name + ' your hiring has been cancelled',
                }, hiring.bellboy.fcm_token, { _id: hiring._id.toString(), type: '1' });
            }
            // for real time but not tested
            // const socketUser = req.app.io;
            // const DashboardDetails=await dashboard.getDashboardDetails({});
            // socketUser.emit(`dashboard`,DashboardDetails);
            return res.status(200).send(ResponseService.success(hiring))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async feedback(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);


            if (!data.hiring_id) throw new apiErrors.ValidationError('hiring_id', messages.HIRING_ID_VALIDATION);
            if (!data.message) throw new apiErrors.ValidationError('message', 'Message Required');
            if (!data.level) throw new apiErrors.ValidationError('level', 'Level Required');


            let hiring = await HiringService.getHiringSimply({ customer: user_id, _id: data.hiring_id, status: 4, hasFeedback: false });
            if (!hiring) return res.send(ResponseService.success({}, 'No Hiring', false));


            let feedback = {
                message: data.message,
                level: data.level
            }




            hiring.hasFeedback = true;
            hiring.feedback = feedback;
            await hiring.save();

            hiring = await HiringService.getHiring({ _id: data.hiring_id });

            let admins = await AdminService.getAdmins({ status: true });

            let tokens = [];


            if (admins.length > 0) {
                admins.forEach(element => {
                    if (element.fcm_token != '')
                        tokens.push(element.fcm_token);
                });
                if (tokens.length > 0) {
                    var msg = await PushNotificationService.notifyMultipleDevices(
                        {
                            title: 'Feedback Posted',
                            body: data.message
                        },
                        tokens,
                        {
                            _id: hiring.hiring_id.toString(),
                            type: '2'
                        }
                    );
                }

            }


            return res.send(ResponseService.success({}, 'Thanks for Providing feedback', true));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new HiringController();
