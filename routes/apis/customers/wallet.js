const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const WalletController = require('../../../controllers/customer/wallet')

router.get('/', jwtAuth, WalletController.getWallet)

module.exports = router;