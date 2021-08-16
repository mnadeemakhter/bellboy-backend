const express = require('express')
const router = express.Router()
const ProductController = require('../../../controllers/customer/products')


router.get('/', ProductController.getActiveProducts)

module.exports = router;