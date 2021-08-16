const BellBoyService = require('../../services/bell-boy')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const DatabaseService = require('./../../common/push-notification')
const messages = require('../../common/messages')

const PushNotificationService = require('../../common/push-notification')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')
const ChargesService = require('../../services/charges')
const OrderService = require('../../services/order')
const { VALUE_VALIDATION } = require('../../common/messages')
var toFixed = require('tofixed');

class UserController {
    async acceptOrder(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);

            if (!data.order) throw new apiErrors.ResourceNotFoundError('order');


            let order = await OrderService.getOrder({ bellboy: user_id, _id: data.order, status: { $gt: 1, $lt: 6 }, is_completed: false });

            if (order) return res.send(ResponseService.success({}, 'Already Assigned', false))

            order = await OrderService.getOrder({ bellboy: user_id, _id: data.order, status: { $gte: 6 }, });

            if (order) return res.send(ResponseService.success({}, 'No Operations can be perform', false))

            order = await OrderService.getOrder({ _id: data.order });
            order.bellboy = user_id;
            order.start_time = Date.now();
            order.status = 2;

            order = await order.save();
            order = await OrderService.getOrder({ _id: data.order });

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];


            await PushNotificationService.notifySingleDevice({ title: 'Delivery Recieved', body: 'BellBoy ' + order.bellboy.name + ' is assigned to fullfil your delivery', }, order.customer.fcm_token, { _id: order._id.toString(), type: '1' });

            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async getOrder(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let order = await OrderService.getOrder({ bellboy: user_id, status: { $gt: 1, $lt: 6 }, is_completed: false });

            if (!order) return res.send(ResponseService.success({}, 'No Active Order', false));

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];


            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async getOrderDetail(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.query);

            if (!data.order_id) throw new apiErrors.ValidationError('order_id', messages.ORDER_ID_VALIDATION);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            let order = await OrderService.getOrder({ order_id: data.order_id });

            if (!order) return res.send(ResponseService.success({}, 'No Order Found', false));


            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];


            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
    async manageOrderStatus(req, res) {
        try {
            const user_id = req._user_info._user_id;

            let data = Object.assign({}, req.body);

            let order = await OrderService.getOrder({ bellboy: user_id, status: { $gte: 1, $lte: 6 }, is_completed: false });

            if (!order) return res.send(ResponseService.success({}, 'No Active Order', false));

            let notificationMessage = {}
            order.status = order.status + 1;
            switch (order.status) {
                case 3:
                    notificationMessage = {
                        title: 'Shopping Started',
                        body: 'BellBoy ' + order.bellboy.name + ' is at the store',
                    };
                    break;
                case 4:
                    notificationMessage = {
                        title: 'On The Way',
                        body: 'BellBoy ' + order.bellboy.name + ' is on the way to you',
                    };
                    break;


            }
            if (order.status == 5) {

                let records = await DatabaseService.getRecords(order._id.toString());
                let charges = await ChargesService.getCharges({ 'service_type': 1 });
                let fuelCharges = 0.0;
                let serviceCharges = 0.0;
                let timeCosting = 0.0;
                let waitingCharges = 0.0;
                let end_time = Date.now();
                order.end_time = end_time;

                let firstDate = end_time;
                let secondDate = new Date(order.start_time);

                var difference = firstDate - secondDate.getTime();
                var totalTime = Math.floor(difference / 1000 / 60);
                difference -= totalTime * 1000 * 60;

                charges.forEach(element => {
                    switch (element.charges_type) {
                        case 1:
                            serviceCharges = element.value;
                            break;
                        case 2:
                            fuelCharges = element.value;
                            break;
                        case 3:
                            timeCosting = element.value;
                            break;
                        case 4:
                            waitingCharges = element.value;
                            break;
                    }
                });
                var billValue = 0.0;
                if(order.bill_images.length>0){
                    order.bill_images.forEach(element => {
                        billValue+=element.bill;
                    });
                }
                let totalBill = (fuelCharges * records.distance) + serviceCharges + (timeCosting * totalTime) + 0.0+billValue;
                let costing = {
                    totalDistance: records.distance,
                    totalTime: totalTime,

                    fuelCharges: {
                        calculated: fuelCharges * records.distance,
                        defined: fuelCharges
                    },
                    serviceCharges: {
                        calculated: serviceCharges,
                        defined: serviceCharges,
                    },
                    timeCosting: {
                        calculated: timeCosting * totalTime,
                        defined: timeCosting
                    },
                    waitingCharges: {
                        calculated: 0.0,
                        defined: waitingCharges
                    },
                    totalBill: totalBill,
                }
               
                order.charges = costing;

                notificationMessage = {
                    title: 'Meet and Pay Bill',
                    body: 'Please pay the bill ' + totalBill + ' PKR to BellBoy ' + order.bellboy.name + '!',
                };


            }

            if (order.status == 6) {
                if (!data.amountReceived) throw new apiErrors.ValidationError('amountReceived', VALUE_VALIDATION);
                let amountReceived = data.amountReceived;
                order.is_completed = true;
                notificationMessage = {
                    title: 'Thank You',
                    body: 'Thanks for Paying ' +toFixed(amountReceived,2) + ' PKR To' + order.bellboy.name,
                };
                order.charges.amountReceived = amountReceived;
            }
            order = await order.save();

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];

            await PushNotificationService.notifySingleDevice(notificationMessage, order.customer.fcm_token, { _id: order._id.toString(), type: '1' });


            return res.send(ResponseService.success(order));
        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async getOrders(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.query);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            let request = {};
            request = {
                status: { $gte: 6, $lte: 7 },
                bellboy: user_id
            };





            let orders = await OrderService.getOrdersForBellBoy(request)


            if (orders.length == 0) return res.status(200).send(ResponseService.success({ orders: [], count: 0 }, 'No Order Found', false))

            let total = orders.length;

            for (const order of orders) {

                order.category = LocalizationService.getLabels([order.category], 'en')[0];
            }


            return res.status(200).send(ResponseService.success({ orders: orders, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async addBillImage(req, res) {
        try {
            let data = Object.assign({}, req.body);
            if (!data.order) throw new apiErrors.ValidationError('order', messages.ID_VALIDATION);
            if (!data.bill) throw new apiErrors.ValidationError('bill', 'Bill amount Required');
            if (!req.file) throw new apiErrors.ValidationError('image', messages.IMAGE_VALIDATION);
            let order = await OrderService.getOrder({ _id: data.order });
            if (!order) return res.send(ResponseService.success({}, 'No Order Found', false));
            let image;
            if (req.file) {
                // image = req.file.destination + '/' + req.file.filename;
                image = req.file.key;

                order.bill_images.push({
                    bill:data.bill,
                    image:image,
                });
                order = await order.save();
            }


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];
            return res.send(ResponseService.success(order));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }

    async removeBillImage(req, res) {
        try {
            let data = Object.assign({}, req.body);

            if (!data.order) throw new apiErrors.ValidationError('order', messages.ID_VALIDATION);
            let order = await OrderService.getOrder({ _id: data.order });
            if (!order) return res.send(ResponseService.success({}, 'No Order Found', false));

            await OrderService.updateOrder({_id:data.order},{ $pull: { 'bill_images': { _id: new mongoose.Types.ObjectId(data.bill) } } });
            order = await order.save();
            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))
            order.items = LocalizationService.getLabelsForCart(order.items, 'en');
            order.category = LocalizationService.getLabels([order.category], 'en')[0];

            return res.send(ResponseService.success(order));


        } catch (error) {
            res.send(ResponseService.failure(error));
        }
    }
}

module.exports = new UserController();