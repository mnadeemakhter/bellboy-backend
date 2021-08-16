const express = require('express')
const router = express.Router()
const AddressController = require('../../../controllers/customer/address')
const jwtAuth = require('../../../middlewares/jwt-auth')
const path = require('path').resolve;

router.get('/', jwtAuth, AddressController.getAddresses)
router.post('/', jwtAuth, AddressController.addAddress)
router.post('/remove', jwtAuth, AddressController.removeAddress)

module.exports = router;