const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const BellBoyTypeController = require('../../../controllers/customer/bellboy-type')

router.get('/', jwtAuth, BellBoyTypeController.getBellBoyTypes)

module.exports = router;