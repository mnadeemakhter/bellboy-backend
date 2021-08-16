const express = require('express')
const router = express.Router()
const WalletTypeController = require('../../../controllers/customer/wallet-type')


router.get('/', WalletTypeController.getActiveWalletTypes)

module.exports = router;