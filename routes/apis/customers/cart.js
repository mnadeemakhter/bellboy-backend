const express = require('express')
const router = express.Router()
const CartController = require('../../../controllers/customer/cart')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const Upload = require(path('common/multer'))
const VoiceUpload = require(path('common/voice-multer'))

router.put('/addToCart',jwtAuth, Upload.single('image'),  CartController.addToCart)
router.put('/addVoiceNote',jwtAuth, VoiceUpload.single('voiceNote'),  CartController.addVoiceNote)
router.post('/removeFromCart',jwtAuth,   CartController.removeFromCart)
router.post('/removeVoiceNote',jwtAuth,   CartController.removeVoiceNote)
router.put('/addAddress',jwtAuth,   CartController.addAddress)
router.put('/removeAddress',jwtAuth,   CartController.removeAddress)
router.put('/updateCartItem',jwtAuth, Upload.single('image'),  CartController.updateCart)
router.get('/',jwtAuth,   CartController.getCart)
router.delete('/',jwtAuth,   CartController.deleteCart)

module.exports = router;