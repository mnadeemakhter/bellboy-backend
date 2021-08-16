const express = require('express')
const router = express.Router()

const AdminVehicleController = require('../../../controllers/admin/vehicle')

const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, AdminVehicleController.getVehicles);
router.get('/:vehicle',jwtAuth, AdminVehicleController.getVehicle);
router.post('/approval',jwtAuth, AdminVehicleController.approveVehicle);
router.post('/toggle', jwtAuth,AdminVehicleController.toggleVehicleStatus);


module.exports = router;