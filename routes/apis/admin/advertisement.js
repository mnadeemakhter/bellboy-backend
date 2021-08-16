const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const AdvertisementController = require('../../../controllers/admin/advertisement')


const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, AdvertisementController.getAdvertisements)
router.post('/',jwtAuth, multer.single('image'), AdvertisementController.addAdvertisement)

router.put('/',jwtAuth, multer.single('image'), AdvertisementController.updateAdvertisement)
router.delete('/:id',jwtAuth, AdvertisementController.deleteAdvertisement)


module.exports = router;