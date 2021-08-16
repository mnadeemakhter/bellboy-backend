const CategoryService = require('../../services/category')
const ProductService = require('../../services/product')
const BellBoyService = require('../../services/bell-boy')
const CartService = require('../../services/cart')
const OrderService = require('../../services/order')
const ResponseService = require('../../common/response')
const apiErrors = require('../../common/api-errors')
const PushNotificationService = require('../../common/push-notification')
const messages = require('../../common/messages')

const LocalizationService = require('../../common/localization')
const LocaleService = require('../../services/locales')


const cryptoRandomString = require('crypto-random-string')
const { token } = require('morgan')

class OrderController {
    async placeOrder(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.body);

            if (!data.bellboyType) throw new apiErrors.ValidationError('bellboyType', messages.BELLBOY_TYPE_VALIDATION);

            let cart = await CartService.getCartSimply({ customer: user_id });

            if (!cart) throw new apiErrors.ResourceNotFoundError('cart', 'No Cart exists');


            let isActive = await CategoryService.isActive({ _id: cart.category.toString() });
            console.log(cart.category);
            if (!isActive) throw new apiErrors.InActiveError('category');


            let uniqueId;
            let order;
            while (1) {
                uniqueId = cryptoRandomString({ length: 6 });

                order = await OrderService.getOrderSimply({ order_id: uniqueId })
                if (!order) break;
                else continue;

            }

            let newData = await OrderService.createOrder({
                order_id: uniqueId,
                customer: user_id,
                category: cart.category,
                items: cart.items,
                voice_note: cart.voice_note,
                hasDelivery: cart.hasDelivery,
                hasPickUp: cart.hasPickUp,
                deliveryAddress: cart.deliveryAddress,
                pickUpAddress: cart.pickUpAddress,
                bellboyType: data.bellboyType
            });
            if (newData) {
                await CartService.deleteCart({ customer: user_id });
            }

            order = await OrderService.getOrder({ _id: newData._id });

            let bellboys = await BellBoyService.getBellboys({working_status:true,bellboyType:data.bellboyType});

            let tokens = [];


            bellboys.forEach(async element => {
                if (element.fcm_token != '') {
                    tokens.push(element.fcm_token);
                    await PushNotificationService.notifySingleDevice({ title: 'New Delivery', body: 'Congrats! ' + element.name + ' you have recieved a new delivery' }, element.fcm_token, { _id: order._id.toString(), type: '1' });

                }

            });

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))



            order.category = LocalizationService.getLabels([order.category], 'en')[0];
            order.items = LocalizationService.getLabelsForCart(order.items, code);


            return res.status(200).send(ResponseService.success(order))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
    async getOrders(req, res) {
        try {
            const user_id = req._user_info._user_id;
            let data = Object.assign({}, req.query);


            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))


            if (!data.type) throw new apiErrors.ValidationError('type', messages.TYPE_VALIDATION);

            let request = {};
            if (data.type == 1) {
                request = {
                    status: { $gte: 1, $lte: 5 },
                    customer: user_id
                };
            }
            else {
                request = {
                    status: { $gte: 6, $lte: 7 },
                    customer: user_id
                };
            }



            let total = await OrderService.OrderTotalCount(request)

            let orders = await OrderService.getOrdersForCustomer(request)




            if (orders.length != 0) {
                for (const order of orders) {

                    order.category = LocalizationService.getLabels([order.category], 'en')[0];
                }
            }



            return res.status(200).send(ResponseService.success({ orders: orders, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
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



            let request = { customer: user_id, order_id: data.order_id };

            let order = await OrderService.getOrder(request)

            if (!order) res.status(200).send(ResponseService.success({}, 'Order Completed', false))


            order.category = LocalizationService.getLabels([order.category], 'en')[0];
            order.items = LocalizationService.getLabelsForCart(order.items, code);

            return res.status(200).send(ResponseService.success(order))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }
    async getCancellationReason(req, res) {
        try {
            let data = Object.assign({}, req.query);
            if (!data.order) throw new apiErrors.ValidationError('order', messages.ORDER_ID_VALIDATION)
            let order = await OrderService.getOrder({ order_id: data.order });

            if (!order) throw new apiErrors.NotFoundError('order', 'No Order Found against this ID');

            let status = order.status;

            let reasons = [];
            if (status > 0 && status < 6) {
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
                    case 4:
                        reasons = messages.stage4;
                        break;
                    case 5:
                        reasons = messages.stage5;
                        break;
                }
            }

            return res.status(200).send(ResponseService.success({ reasons: reasons }))
        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }

    async canceOrder(req, res) {
        try {

            let data = Object.assign({}, req.body);
            if (!data.order) throw new apiErrors.ValidationError('order', messages.ORDER_ID_VALIDATION);
            if (!data.reason) throw new apiErrors.ValidationError('reason', messages.REASON_VALIDATION);

            let order = await OrderService.getOrder({ order_id: data.order });
            if (order.status > 5) throw new apiErrors.UnexpectedError('order', 'Order Cannot be cancelled at this stage');

           
            if (order.status > 1) {
                await PushNotificationService.notifySingleDevice({
                    title: 'Delivery Cancelled',
                    body: order.customer.name + ' cancelled the delivery. Sorry for the inconvenience!!!',
                }, order.bellboy.fcm_token, { _id: order._id.toString(), type: '1' });
            }
            order.status = 7;
            order.cancellation_reason = data.reason;
            order.cancelled_by = 1;
            order = await order.save();

            let code = data.locale || 'en';

            let locale = await LocaleService.getLocale({ code: code });
            if (!locale) return res.send(ResponseService.success({}, 'Invalid Locale Code', false))

            order.category = LocalizationService.getLabels([order.category], 'en')[0];
            order.items = LocalizationService.getLabelsForCart(order.items, code);

            return res.status(200).send(ResponseService.success(order))

        } catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }
    }
}

module.exports = new OrderController();