const express = require('express')
const router = express.Router();
const VersionController = require('../../../controllers/customer/version')

router.get('/',VersionController.getVersion)

module.exports = router;