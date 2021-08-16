const express = require('express')
const router = express.Router()
const CartController = require('../../../controllers/customer/hiring-cart')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const Upload = require(path('common/multer'))
const VoiceUpload = require(path('common/voice-multer'))

router.post('/addToCart',jwtAuth, Upload.fields([
    { name: 'images', maxCount: 8 },
    { name: 'voiceNote', maxCount: 1 }
  ]),  CartController.addToHiringCart)
router.post('/addVoiceNote',jwtAuth, VoiceUpload.single('voiceNote'),  CartController.addVoiceNote)
router.delete('/removeFromCart',jwtAuth,   CartController.removeFromHiringCart)
router.delete('/deleteCart',jwtAuth,   CartController.deleteCart)
router.delete('/removeVoiceNote',jwtAuth,   CartController.removeVoiceNote)
router.get('/',jwtAuth,   CartController.getHiringCart)



module.exports = router;