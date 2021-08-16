const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const CategoryController = require('../../../controllers/admin/category')

const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, CategoryController.getCategories)
router.get('/:id/:locale',jwtAuth, CategoryController.getCategory)
router.post('/',jwtAuth, multer.single('icon'), CategoryController.addCategory)
router.put('/',jwtAuth, multer.single('icon'), CategoryController.updateCategory)
router.post('/assignLabel',jwtAuth, CategoryController.assignLabel)
router.post('/toggle',jwtAuth, CategoryController.toggleCategory)
router.get('/all',jwtAuth, CategoryController.getAllCategories)

// router.put('/addDepartments', CategoryController.addDepartments)
// router.put('/removeDepartments', CategoryController.removeDepartments)
module.exports = router;