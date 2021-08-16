const express = require('express')
const router = express.Router()
const UserController = require('../../../controllers/customer/user')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const Upload = require(path('common/multer'))
router.get('/', jwtAuth, UserController.getProfile)
router.put('/', jwtAuth,Upload.single('avatar'), UserController.updateProfile)
router.post('/token', jwtAuth, UserController.registerToken);

module.exports = router;