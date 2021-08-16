const express = require('express')
const router = express.Router()
const path = require('path').resolve;
const UserController = require('../../../controllers/admin/user')
const multer = require(path('common/multer'))

const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, UserController.getAdmins)
router.get('/:_id',jwtAuth, UserController.getAdmin)
//router.post('/',jwtAuth, Upload.none(), UserController.addAdmin)
router.put('/', jwtAuth,multer.single('image'), UserController.updateAdmin)

router.post('/token', jwtAuth, UserController.registerToken);
module.exports = router;