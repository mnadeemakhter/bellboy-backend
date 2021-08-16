const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const HiringActionTypeController = require('../../../controllers/admin/hiring-action-type')


const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, HiringActionTypeController.getHiringActionTypes)
router.post('/',jwtAuth,multer.single('icon'), HiringActionTypeController.addHiringActionType)

router.put('/',jwtAuth, multer.single('icon'), HiringActionTypeController.updateHiringActionType)
router.post('/assignLabel',jwtAuth, HiringActionTypeController.assignLabel)
module.exports = router;