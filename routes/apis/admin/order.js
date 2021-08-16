const express = require('express')
const router = express.Router();

const OrderController = require('../../../controllers/admin/order')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, OrderController.getOrders)
router.get('/:order_id',jwtAuth, OrderController.getOrderDetail)

module.exports = router;