const express = require('express')
const router = express.Router()
const ComplaintController = require('../../../controllers/customer/complaint')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;

router.get('/', jwtAuth, ComplaintController.getComplaints)
router.post('/', jwtAuth, ComplaintController.addComplaint)

module.exports = router;