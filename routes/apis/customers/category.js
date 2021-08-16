const express = require('express')
const router = express.Router()
const CategoryController = require('../../../controllers/customer/category')


router.get('/', CategoryController.getActiveCategories)

module.exports = router;