const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const BrandController = require('../../../controllers/admin/brands')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, BrandController.getBrands)
router.get('/:id/:locale',jwtAuth, BrandController.getBrand)
router.post('/',jwtAuth, multer.single('icon'), BrandController.addBrand)
router.put('/',jwtAuth, multer.single('icon'), BrandController.updateBrand)
router.post('/assignLabel',jwtAuth, BrandController.assignLabel)
router.get('/all',jwtAuth, BrandController.getAllBrands)

module.exports = router;