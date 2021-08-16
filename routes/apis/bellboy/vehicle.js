const express = require('express')
const router = express.Router();
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;


const upload=require("../../../common/s3-validation");


//BellBoy Multer
// const Upload = require(path('common/bellboy-multer'))
const BellBoyVehicleController = require('../../../controllers/bellboy/vehicle')

router.get('/vehicleTypes', jwtAuth, BellBoyVehicleController.getAllVehicleTypes);
router.get('/vehicleBrands', jwtAuth, BellBoyVehicleController.getAllVehicleBrands);
router.get('/vehicleModels', jwtAuth, BellBoyVehicleController.getAllVehicleModels);
router.post('/', jwtAuth, upload.upload("bellboy/vehicle").fields([
    { name: 'front_image', maxCount: 1 },
    { name: 'back_image', maxCount: 1 },
    { name: 'left_image', maxCount: 1 },
    { name: 'right_image', maxCount: 1 },
    { name: 'plate_image', maxCount: 1 },
    { name: 'vehicle_reg_front_image', maxCount: 1 },
    { name: 'vehicle_reg_back_image', maxCount: 1 },
    { name: 'vehicle_reg_other_image', maxCount: 1 },

]), BellBoyVehicleController.addVehicle);
router.get('/', jwtAuth, BellBoyVehicleController.getVehicles);
router.get('/vehicleDetail', jwtAuth, BellBoyVehicleController.getVehicleDetail);

module.exports = router;