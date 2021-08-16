const express = require('express')
const router = express.Router()
const HiringController = require('../../../controllers/customer/hirings')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;

router.post('/', jwtAuth, HiringController.placeOrder)
router.get('/getReasons', jwtAuth, HiringController.getCancellationReason)
router.post('/cancelHiring', jwtAuth, HiringController.canceOrder)
router.put('/manageActionCancellationStatus', jwtAuth, HiringController.manageActionCancellationStatus);
router.post('/verify', jwtAuth, HiringController.verifyCode)
router.get('/hiringDetail', jwtAuth, HiringController.getHiringDetail)
router.put('/feedback', jwtAuth, HiringController.feedback)
router.get('/', jwtAuth, HiringController.getOrders)

module.exports = router;