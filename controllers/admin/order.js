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
  
    async getOrders(req, res) {
        try {
          
            let data = Object.assign({}, req.query);

            let pageNo = parseInt(req.query.pageNo || 1)
            let perPage = parseInt(req.query.perPage || 10)
            let search = req.query.search || ''

        
            let filters = { order_id: new RegExp(search, 'i'), };

            if(data.status){
                filters.status = data.status;
            }
            if(data.customer){
                filters.customer = data.customer;
            }

            if(data.bellboy){
                filters.bellboy = data.bellboy;
            }

            if(data.bellboyType){
                filters.bellboyType = data.bellboyType;
            }
          
           



            let total = await OrderService.OrderTotalCount(filters)

            let orders = await OrderService.getOrdersForAdmin(filters,perPage,pageNo);



            return res.status(200).send(ResponseService.success({ orders: orders, count: total }))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

    async getOrderDetail(req, res) {
        try {
           
            let data = Object.assign({}, req.params);

            if (!data.order_id) throw new apiErrors.ValidationError('order_id', messages.ORDER_ID_VALIDATION);

            let request = { order_id: data.order_id };

            let order = await OrderService.getOrder(request)

            if (!order) throw new apiErrors.ResourceNotFoundError('order_id');


            return res.status(200).send(ResponseService.success(order))

        }
        catch (error) {
            return res.status(500).send(ResponseService.failure(error))
        }

    }

}

module.exports = new OrderController();