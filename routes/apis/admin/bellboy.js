const express = require('express')
const router = express.Router()
const path = require('path').resolve

const AdminBellBoyController = require('../../../controllers/admin/bellboy')
const BellBoyController = require('../../../controllers/bellboy/user')

const Upload = require(path('common/multer'))
const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, AdminBellBoyController.getBellBoys);
router.get('/completedOrder/:bellboy',jwtAuth, AdminBellBoyController.getBellboyCompletedOrder);
router.get("/getBellboyActivity/:bellboy",jwtAuth,AdminBellBoyController.getBellboyActivity);
router.get("/bellboyactivity/:id",jwtAuth,AdminBellBoyController.bellboyActivityForcurrent)
router.get('/:bellboy',jwtAuth, AdminBellBoyController.getBellBoyDetail);

router.post('/approveNIC', jwtAuth,AdminBellBoyController.approveNIC);
router.post('/approveDrivingLicense',jwtAuth, AdminBellBoyController.approveDrivingLicense);
router.put('/toggle',jwtAuth, AdminBellBoyController.toggle);
router.put('/sendMail',jwtAuth, AdminBellBoyController.sendMail);

module.exports = router;