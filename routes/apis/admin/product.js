const express = require('express')
const router = express.Router();
const ProductController = require('../../../controllers/admin/products')
const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, ProductController.getProducts)
router.get('/:id', jwtAuth,ProductController.getProduct)
router.post('/',jwtAuth, ProductController.addProduct)
router.post('/assignLabel',jwtAuth, ProductController.assignLabel)
router.put('/addCategory',jwtAuth, ProductController.addCategory)
router.put('/removeCategory',jwtAuth, ProductController.removeCategory)
router.put('/addBrands',jwtAuth, ProductController.addBrand)
router.put('/removeBrands', jwtAuth,ProductController.removeBrand)
module.exports = router;