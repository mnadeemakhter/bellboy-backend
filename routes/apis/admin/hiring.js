const express = require('express')
const router = express.Router();

const HiringController = require('../../../controllers/admin/hiring')


const jwtAuth = require('../../../middlewares/jwt-auth')


router.get('/',jwtAuth, HiringController.getHirings)
router.get('/bellboy',jwtAuth, HiringController.getBellBoys)
router.post('/bellboy/assign',jwtAuth, HiringController.assignBellBoy)
router.post('/close',jwtAuth, HiringController.closeHiring)
router.get("/customer/:customer",jwtAuth,HiringController.getHiringByCustomerIdAdmin)
router.get("/estimatedDistance",jwtAuth,HiringController.getEstimatedDistance)
// router.get("/byDate",jwtAuth,HiringController.getHiringByDate)
router.get('/:hiring_id',jwtAuth, HiringController.getHiringDetail)
module.exports = router;