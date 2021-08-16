const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const Upload = require(path('common/multer'))

const OrderController = require('../../../controllers/bellboy/order')

router.post('/', jwtAuth, OrderController.acceptOrder);
router.get('/', jwtAuth, OrderController.getOrder);
router.put('/', jwtAuth, OrderController.manageOrderStatus);
router.get('/orderHistory', jwtAuth, OrderController.getOrders);
router.get('/orderDetail', jwtAuth, OrderController.getOrderDetail);
router.post('/addBillImage',jwtAuth, Upload.single('image'),  OrderController.addBillImage)
router.delete('/removeBillImage',jwtAuth,  OrderController.removeBillImage)



module.exports = router;