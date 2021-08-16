const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const WalletType = require('../../../controllers/admin/wallet-type')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, WalletType.getWalletTypes)
router.post('/',jwtAuth,multer.single('icon'), WalletType.addWalletType)
router.post('/assignLabel',jwtAuth, WalletType.assignLabel)
module.exports = router;