const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const Upload = require(path('common/multer'))

const HiringController = require('../../../controllers/bellboy/hirings')

router.post('/', jwtAuth, HiringController.acceptHiring);
router.get('/', jwtAuth, HiringController.getHirings);
// router.put('/', jwtAuth, HiringController.manageHiringStatus);
// router.get('/HiringHistory', jwtAuth, HiringController.getHirings);
router.get('/hiringDetail', jwtAuth, HiringController.getHiringDetail);
router.put('/manageActionStatus', jwtAuth, HiringController.manageActionStatus);
router.put('/startTask', jwtAuth, HiringController.startTask);
router.put('/manageActionCancellationStatus', jwtAuth, HiringController.manageActionCancellationStatus);
router.put('/manageHiringStatus', jwtAuth, HiringController.manageHiringStatus);
router.put('/verify', jwtAuth, HiringController.verifyCode);
router.post('/addBillImage',jwtAuth, Upload.single('image'),  HiringController.addBillImage)
router.delete('/removeBillImage',jwtAuth,  HiringController.removeBillImage)


module.exports = router;