const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const BellBoyTypeController = require('../../../controllers/admin/bellboy-type')


const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, BellBoyTypeController.getBellBoyTypes)
router.post('/',jwtAuth, multer.single('icon'), BellBoyTypeController.addBellBoyType)
router.post('/assignLabel',jwtAuth, BellBoyTypeController.assignLabel)

router.post('/update',jwtAuth, multer.single('icon'), BellBoyTypeController.updateBellBoyType)
module.exports = router;