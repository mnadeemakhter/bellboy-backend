const express = require('express')
const router = express.Router();
const ChargesController = require('../../../controllers/admin/charges')

const jwtAuth = require('../../../middlewares/jwt-auth')

router.get('/',jwtAuth, ChargesController.getCharges)
router.get('/all',jwtAuth, ChargesController.getAllCharges)
router.get('/d',jwtAuth, ChargesController.getD)
router.post('/',jwtAuth, ChargesController.manageCharge)
module.exports = router;