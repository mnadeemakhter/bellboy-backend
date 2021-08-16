const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const VehicleBrandController = require('../../../controllers/admin/vehicle-brand')
const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/', jwtAuth,VehicleBrandController.getVehicleBrands)
router.get('/:vehicleBrand', jwtAuth,VehicleBrandController.getVehicleBrand)
router.post('/', jwtAuth, multer.single('icon'), VehicleBrandController.addVehicleBrand)
router.post('/assignLabel', jwtAuth, VehicleBrandController.assignLabel)
router.post('/addVehicleTypes', jwtAuth, VehicleBrandController.addVehicleTypes)
router.post('/removeVehicleTypes', jwtAuth, VehicleBrandController.removeVehicleTypes)
module.exports = router;