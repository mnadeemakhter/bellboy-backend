const express = require('express')
const router = express.Router()
const AuthController = require('../../../controllers/common/auth');
const { deviceDetector } = require('../../../middlewares/device_detector');

router.post('/login', deviceDetector, AuthController.customerLogin.bind(AuthController))

module.exports = router;