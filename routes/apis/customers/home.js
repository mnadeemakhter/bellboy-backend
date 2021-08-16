const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const HomeController = require('../../../controllers/customer/home')

router.get('/', jwtAuth, HomeController.getHome)
router.get('/info', jwtAuth, HomeController.getHomeInfo)
router.get('/hiring', jwtAuth, HomeController.getHomeForHiring)
router.post('/location', jwtAuth, HomeController.setCustomerLocation)

module.exports = router;