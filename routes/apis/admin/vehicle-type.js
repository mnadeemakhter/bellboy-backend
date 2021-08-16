const express = require('express')
const router = express.Router();
const path = require('path').resolve;
const multer = require(path('common/multer'))
const VehicleTypeController = require('../../../controllers/admin/vehicle-type')

const jwtAuth = require('../../../middlewares/jwt-auth')



router.get('/',jwtAuth, VehicleTypeController.getVehicleTypes)
router.get('/:vehicleType',jwtAuth, VehicleTypeController.getVehicleType)
router.post('/',jwtAuth, multer.single('icon'), VehicleTypeController.addVehicleType)
router.post('/assignLabel',jwtAuth, VehicleTypeController.assignLabel)
module.exports = router;