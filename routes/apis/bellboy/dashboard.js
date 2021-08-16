const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const DashboardController = require('../../../controllers/bellboy/dashboard')

router.get('/', jwtAuth, DashboardController.getDashboard)

module.exports = router;