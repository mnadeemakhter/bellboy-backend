const express = require('express')
const router = express.Router()
const OrderController = require('../../../controllers/customer/order')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;

router.post('/placeOrder', jwtAuth, OrderController.placeOrder)
router.get('/getReasons',jwtAuth,OrderController.getCancellationReason)
router.post('/cancelOrder',jwtAuth,OrderController.canceOrder)
router.get('/orderDetail',jwtAuth,OrderController.getOrderDetail)
router.get('/',jwtAuth,OrderController.getOrders)

module.exports = router;