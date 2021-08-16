const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const VehicleModelController = require('../../../controllers/admin/vehicle-model')
const jwtAuth = require('../../../middlewares/jwt-auth')



router.get('/',jwtAuth, VehicleModelController.getVehicleModels)
router.get('/:vehicleModel',jwtAuth, VehicleModelController.getVehicleModel)
router.post('/',jwtAuth, multer.single('icon'), VehicleModelController.addVehicleModel)
router.post('/assignLabel',jwtAuth, VehicleModelController.assignLabel)
module.exports = router;