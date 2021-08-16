const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;
const {upload}=require("../../../common/s3-validation")

const UserController = require('../../../controllers/bellboy/user')

//BellBoy Multer
const Upload = require(path('common/bellboy-multer'))
router.get('/profile', jwtAuth, UserController.getProfile);
router.get('/activity', jwtAuth, UserController.bellboyActivity);

router.put('/profile', jwtAuth, Upload.single('avatar'), UserController.updateProfile);

router.post('/nic', jwtAuth, Upload.fields([{ name: 'front_image', maxCount: 1 }, { name: 'back_image', maxCount: 1 }]), UserController.addNIC)

router.post('/driving_license', jwtAuth, Upload.fields([{ name: 'front_image', maxCount: 1 }, { name: 'back_image', maxCount: 1 }]), UserController.addDrivingLicense)

router.post('/add_police_certificate', jwtAuth, upload("bellboy/add_police_certificate").single("image") , UserController.addPoliceCertificate)

router.post('/token', jwtAuth, UserController.registerToken);

router.put('/toggleOnlineStatus', jwtAuth, UserController.toggleOnlineStatus);
router.put('/toggleBellBoyType', jwtAuth, UserController.toggleBellBoyType);


module.exports = router;